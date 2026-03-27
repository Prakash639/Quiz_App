import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronLeft, FileText, Info } from "lucide-react";
import "./review.css";

function Review() {
  const { user_id, attempt_id } = useParams();
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/review/${user_id}/${attempt_id}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.results;

        // Group by question name
        const grouped = [];
        raw.forEach((item) => {
          const existing = grouped.find(g => g.ques_name === item.ques_name);
          if (existing) {
            existing.options.push(item.options);
          } else {
            grouped.push({
              ques_name: item.ques_name,
              correct_option: item.correct_option,
              selected_option: item.selected_option,
              options: [item.options],
            });
          }
        });

        setGroupedData(grouped);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, [user_id, attempt_id]);

  if (!groupedData.length) {
    return (
      <>
        <div className="review-empty">
          <div className="review-empty-icon">📄</div>
          <h2>No review data found.</h2>
          <button className="review-home-btn" onClick={() => navigate("/home")}>Go Back Home</button>
        </div>
      </>
    );
  }

  const correctCount = groupedData.filter(q => q.selected_option === q.correct_option).length;
  const wrongCount = groupedData.length - correctCount;

  return (
    <>
      <div className="review-page">
        <motion.div 
          className="review-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="review-title">Results Review</h1>
          <p className="review-subtitle">Analyzing your performance for this session</p>
          <div className="review-summary-badges">
            <span className="review-badge review-badge-correct">
              <CheckCircle size={14} style={{ marginRight: '6px' }} />
              {correctCount} Correct
            </span>
            <span className="review-badge review-badge-wrong">
              <XCircle size={14} style={{ marginRight: '6px' }} />
              {wrongCount} Incorrect
            </span>
            <span className="review-badge review-badge-total">
              <FileText size={14} style={{ marginRight: '6px' }} />
              {groupedData.length} Total
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="review-questions"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {groupedData.map((item, index) => {
            const isCorrect = item.selected_option === item.correct_option;
            return (
              <motion.div 
                key={index} 
                className={`review-card ${isCorrect ? 'review-card-correct' : 'review-card-wrong'}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="review-card-header">
                  <span className="review-q-num">Question {index + 1}</span>
                  <span className={`review-status ${isCorrect ? 'correct' : 'wrong'}`}>
                    {isCorrect ? 'PERFECT' : 'INCORRECT'}
                  </span>
                </div>

                <h3 className="review-q-text">{item.ques_name}</h3>

                <div className="review-options">
                  {item.options.map((option, i) => {
                    const optIsCorrect = option === item.correct_option;
                    const optIsSelected = option === item.selected_option;

                    let optClass = 'review-opt';
                    if (optIsCorrect) optClass += ' review-opt-correct';
                    if (optIsSelected && !optIsCorrect) optClass += ' review-opt-wrong';

                    return (
                      <div key={i} className={optClass}>
                        <span className="review-opt-text">{option}</span>
                        {optIsCorrect && <CheckCircle size={18} />}
                        {optIsSelected && !optIsCorrect && <XCircle size={18} />}
                      </div>
                    );
                  })}
                </div>

                <div className="review-answer-summary">
                  <div className="summary-row">
                    <Info size={14} className="info-icon" />
                    <p>
                      <span className="review-ans-label">Your Answer:</span> 
                      <span className={isCorrect ? 'text-success' : 'text-danger'}> {item.selected_option}</span>
                    </p>
                  </div>
                  {!isCorrect && (
                    <div className="summary-row">
                      <CheckCircle size={14} className="success-icon" />
                      <p>
                        <span className="review-ans-label">Correct Answer:</span> 
                        <span className="text-success"> {item.correct_option}</span>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <button className="review-home-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>
    </>
  );
}

export default Review;
