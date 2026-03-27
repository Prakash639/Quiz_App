import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./review.css";

function Review() {
  const { user_id, attempt_id } = useParams();
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/review/${user_id}/${attempt_id}`)
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
        <div className="review-header">
          <h1 className="review-title">Quiz Review</h1>
          <p className="review-subtitle">Review your answers below</p>
          <div className="review-summary-badges">
            <span className="review-badge review-badge-correct">✓ {correctCount} Correct</span>
            <span className="review-badge review-badge-wrong">✗ {wrongCount} Wrong</span>
            <span className="review-badge review-badge-total">{groupedData.length} Questions</span>
          </div>
        </div>

        <div className="review-questions">
          {groupedData.map((item, index) => {
            const isCorrect = item.selected_option === item.correct_option;
            return (
              <div key={index} className={`review-card ${isCorrect ? 'review-card-correct' : 'review-card-wrong'}`} style={{ animationDelay: `${index * 0.06}s` }}>
                <div className="review-card-header">
                  <span className="review-q-num">Q{index + 1}</span>
                  <span className={`review-status ${isCorrect ? 'correct' : 'wrong'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
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
                        {optIsCorrect && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {optIsSelected && !optIsCorrect && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="review-answer-summary">
                  <p><span className="review-ans-label">Your Answer:</span> <span className={isCorrect ? 'text-success' : 'text-danger'}>{item.selected_option}</span></p>
                  <p><span className="review-ans-label">Correct Answer:</span> <span className="text-success">{item.correct_option}</span></p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="review-home-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>
    </>
  );
}

export default Review;
