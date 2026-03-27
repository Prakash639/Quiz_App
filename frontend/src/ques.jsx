
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

    fetch(`http://localhost:4000/ques/${id}`)
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

      const res = await fetch(`http://localhost:4000/ques/${id}`, {
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
      <>
        <div className="result-page">
          <div className="result-container">
            {/* Score Ring */}
            <div className="result-ring-wrapper">
              <svg className="result-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={performanceMessage.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="result-ring-progress"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="result-ring-text">
                <span className="result-ring-pct">{Math.round(percentage)}%</span>
                <span className="result-ring-label">Score</span>
              </div>
            </div>

            <h2 className="result-heading">Quiz Complete!</h2>
            <p className="result-message" style={{ color: performanceMessage.color }}>
              {performanceMessage.text}
            </p>

            {/* Stats */}
            <div className="result-stats">
              <div className="result-stat result-stat-correct">
                <span className="result-stat-num">{score}</span>
                <span className="result-stat-label">Correct</span>
              </div>
              <div className="result-stat result-stat-wrong">
                <span className="result-stat-num">{wrongCount}</span>
                <span className="result-stat-label">Wrong</span>
              </div>
              <div className="result-stat result-stat-time">
                <span className="result-stat-num">{formatTime(time)}</span>
                <span className="result-stat-label">Time</span>
              </div>
              <div className="result-stat result-stat-total">
                <span className="result-stat-num">{questions.length}</span>
                <span className="result-stat-label">Total</span>
              </div>
            </div>

            {/* Actions */}
            <div className="result-actions">
              <button className="result-btn result-btn-retry" onClick={() => window.location.reload()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Retake Quiz
              </button>
              {attemptId && (
                <button
                  className="result-btn result-btn-review"
                  onClick={() => navigate(`/review/${user_id}/${attemptId}`)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Review Answers
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ========== QUESTION SCREEN ==========
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <>
      <div className="ques-page">
        <div className="ques-container">
          {/* Progress Bar */}
          <div className="ques-progress-bar">
            <div className="ques-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Header: Question count + Timer */}
          <div className="ques-header">
            <div className="ques-counter">
              <span className="ques-counter-current">{currentIndex + 1}</span>
              <span className="ques-counter-sep">/</span>
              <span className="ques-counter-total">{questions.length}</span>
            </div>
            <div className="ques-timer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatTime(time)}
            </div>
          </div>

          {/* Question */}
          <h2 className="ques-text">{currentQ.ques_name}</h2>

          {/* Options */}
          <div className="ques-options">
            {currentQ.options.map((option, idx) => {
              let status = '';
              if (selectedIndex === idx) status = 'selected';
              if (submitted) {
                if (option.is_correct) status = 'correct';
                else if (selectedIndex === idx && !option.is_correct) status = 'wrong';
              }

              return (
                <button
                  key={idx}
                  className={`ques-option ${status}`}
                  onClick={() => !submitted && setSelectedIndex(idx)}
                  disabled={submitted}
                  id={`option-${idx}`}
                >
                  <span className="ques-option-label">{optionLabels[idx]}</span>
                  <span className="ques-option-text">{option.text}</span>
                  {submitted && option.is_correct && (
                    <svg className="ques-option-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {submitted && selectedIndex === idx && !option.is_correct && (
                    <svg className="ques-option-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action button */}
          {!submitted ? (
            <button
              className="ques-submit-btn"
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              id="submit-answer"
            >
              Submit Answer
            </button>
          ) : (
            <button className="ques-submit-btn ques-next-btn" onClick={handleNext} id="next-question">
              {currentIndex + 1 === questions.length ? "See Results" : "Next Question"}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Ques;
