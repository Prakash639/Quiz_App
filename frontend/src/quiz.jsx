import { useEffect, useState } from "react";
import "./quiz.css";
import { Link, useParams } from "react-router-dom";

function Quiz() {
  const [types, setTypes] = useState([]);
  const { id } = useParams(); // get dynamic ID from URL
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:4000/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => setTypes(data.result))
      .catch((err) => console.error("Failed to fetch quiz types:", err));
  }, [id]);

  const getSubcatEmoji = (index) => {
    const emojis = ['📝', '⚡', '🎯', '🧩', '🏆', '🔥', '📐', '🎓'];
    return emojis[index % emojis.length];
  };

  const getCardAccent = (index) => {
    const accents = [
      'var(--primary)', 'var(--accent)', 'var(--success)',
      'var(--info)', 'var(--warning)', 'var(--danger)',
      '#EC4899', '#14B8A6',
    ];
    return accents[index % accents.length];
  };

  return (
    <>
      {/* Breadcrumb area */}

      {/* Breadcrumb area */}
      <div className="quiz-sub-header">
        <Link to="/home" className="quiz-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Categories
        </Link>
        <h2 className="quiz-sub-title">Choose a subcategory</h2>
        <p className="quiz-sub-desc">Select a topic to start your quiz session</p>
      </div>

      {/* Sub-category Cards */}
      <main className="home-main">
        <div className="home-grid">
          {types.map((type, idx) => (
            <div
              className="quiz-card"
              key={type.id}
              style={{ '--card-accent': getCardAccent(idx), animationDelay: `${idx * 0.08}s` }}
            >
              <div className="quiz-card-accent"></div>
              <div className="quiz-card-emoji">{getSubcatEmoji(idx)}</div>
              <h3 className="quiz-card-title">{type.name}</h3>
              <p className="quiz-card-desc">
                Practice questions and test your skills in <strong>{type.name}</strong>.
              </p>
              <Link
                to={`/ques/${type.id}`}
                className="quiz-card-btn"
                id={`quiz-sub-${type.id}`}
              >
                Start Quiz
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {types.length === 0 && (
          <div className="home-empty">
            <div className="home-empty-icon">📋</div>
            <p>Loading subcategories...</p>
          </div>
        )}
      </main>
    </>
  );
}

export default Quiz;
