
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, Eye } from "lucide-react";
import "./ques.css";

function Ques() {
  const { id } = useParams(); // sub_category ID
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [attemptId, setAttemptId] = useState(localStorage.getItem("attemptId") || null);

  const [time, setTime] = useState(0);
  const user_id = localStorage.getItem("userId");

  useEffect(() => {
    // Reset old attempt ID on quiz start
    localStorage.removeItem("attemptId");
    setAttemptId(null);

    fetch(`${import.meta.env.VITE_API_URL}/ques/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.result))
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  useEffect(() => {
    if (!showScore) {
      const timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showScore]);

  const formatTime = (t) => {
    const mins = String(Math.floor(t / 60)).padStart(2, "0");
    const secs = String(t % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentQ = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedIndex === null) return;

    const selectedOption = currentQ.options[selectedIndex];
    const isCorrect = selectedOption.is_correct;

    setSubmitted(true);

    let tempScore = score;
    if (isCorrect) tempScore += 1;
    setScore(tempScore);

    const isLast = currentIndex + 1 === questions.length;

    try {
      const body = {
        question_id: currentQ.id,
        selected_option_id: selectedOption.option_id,
        sub_categories_id: parseInt(id),
        user_id,
        attempt_id: attemptId,
      };

      if (isLast) {
        body.isLast = true;
        body.correct_ans = tempScore;
        body.total_ques = questions.length;
        body.attempt = 1;
        body.time_taken = time;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ques/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Answer not submitted");

      if (data.attempt_id && !attemptId) {
        setAttemptId(data.attempt_id);
        localStorage.setItem("attemptId", data.attempt_id);
      }

      if (isLast) {
        setShowScore(true);
      }
    } catch (error) {
      console.error("Answer submission error:", error.message);
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  if (!currentQ && !showScore) {
    return (
      <div className="ques-loading">
        <div className="ques-loading-spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  // ========== RESULT SCREEN ==========
  if (showScore) {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    const wrongCount = questions.length - score;
    const performanceMessage =
      percentage >= 90
        ? { text: "Outstanding! You nailed it! 🏆", color: "var(--success)" }
        : percentage >= 75
          ? { text: "Great job! Well done! 👏", color: "var(--primary)" }
          : percentage >= 50
            ? { text: "Good effort! Keep practicing! 👍", color: "var(--warning)" }
            : { text: "Keep going! Practice makes perfect! 💡", color: "var(--danger)" };

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="result-page">
        <motion.div 
          className="result-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          {/* Score Ring */}
          <div className="result-ring-wrapper">
            <svg className="result-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none"
                stroke={performanceMessage.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="result-ring-text">
              <motion.span 
                className="result-ring-pct"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.round(percentage)}%
              </motion.span>
              <span className="result-ring-label">Score</span>
            </div>
          </div>

          <motion.h2 
            className="result-heading"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Complete!
          </motion.h2>
          <motion.p 
            className="result-message" 
            style={{ color: performanceMessage.color }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {performanceMessage.text}
          </motion.p>

          {/* Stats */}
          <div className="result-stats">
            {[
              { label: "Correct", val: score, color: "correct", icon: <CheckCircle2 size={18} /> },
              { label: "Wrong", val: wrongCount, color: "wrong", icon: <XCircle size={18} /> },
              { label: "Time", val: formatTime(time), color: "time", icon: <Timer size={18} /> },
              { label: "Total", val: questions.length, color: "total", icon: <Trophy size={18} /> }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className={`result-stat result-stat-${stat.color}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
              >
                <div className="result-stat-icon-wrap">{stat.icon}</div>
                <span className="result-stat-num">{stat.val}</span>
                <span className="result-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>


          {/* Actions */}
          <div className="result-actions">
            <motion.button 
              className="result-btn result-btn-retry" 
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={18} />
              Retake Quiz
            </motion.button>
            {attemptId && (
              <motion.button
                className="result-btn result-btn-review"
                onClick={() => navigate(`/review/${user_id}/${attemptId}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={18} />
                Review
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }


  // ========== QUESTION SCREEN ==========
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <>
      <div className="ques-page">
        <motion.div 
          className="ques-container"
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress Bar */}
          <div className="ques-progress-bar">
            <motion.div 
              className="ques-progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="ques-header">
            <div className="ques-counter">
              <span className="ques-counter-current">{currentIndex + 1}</span>
              <span className="ques-counter-sep">/</span>
              <span className="ques-counter-total">{questions.length}</span>
            </div>
            <div className="ques-timer">
              <Timer size={16} />
              {formatTime(time)}
            </div>
          </div>

          {/* Question */}
          <h2 className="ques-text">{currentQ.ques_name}</h2>

          {/* Options */}
          <div className="ques-options">
            <AnimatePresence mode="popLayout">
              {currentQ.options.map((option, idx) => {
                let status = '';
                if (selectedIndex === idx) status = 'selected';
                if (submitted) {
                  if (option.is_correct) status = 'correct';
                  else if (selectedIndex === idx && !option.is_correct) status = 'wrong';
                }

                return (
                  <motion.button
                    key={idx}
                    className={`ques-option ${status}`}
                    onClick={() => !submitted && setSelectedIndex(idx)}
                    disabled={submitted}
                    whileHover={!submitted ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!submitted ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="ques-option-label">{optionLabels[idx]}</span>
                    <span className="ques-option-text">{option.text}</span>
                    {submitted && option.is_correct && <CheckCircle2 className="ques-option-icon" size={20} />}
                    {submitted && selectedIndex === idx && !option.is_correct && <XCircle className="ques-option-icon" size={20} />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Action button */}
          <motion.div 
            className="ques-action-container"
            layout
          >
            {!submitted ? (
              <motion.button
                className="ques-submit-btn"
                onClick={handleSubmit}
                disabled={selectedIndex === null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Answer
              </motion.button>
            ) : (
              <motion.button 
                className="ques-submit-btn ques-next-btn" 
                onClick={handleNext}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentIndex + 1 === questions.length ? "See Results" : "Next Question"}
                <ChevronRight size={20} />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Ques;
