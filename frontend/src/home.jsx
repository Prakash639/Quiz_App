
import { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate, useParams } from "react-router-dom";

function Home() {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId);

  useEffect(() => {
    // Fetch quiz types from backend
    fetch("http://localhost:4000/home")
      .then((res) => res.json())
      .then((data) => setTypes(data.result)) // assuming backend sends { result: [...] }
      .catch((err) => console.error("Failed to fetch quiz types:", err));
  }, []);

  const getCategoryEmoji = (name) => {
    const map = {
      'Programming': '💻', 'Aptitude': '🧮', 'Reasoning': '🧠',
      'Verbal': '📝', 'General Knowledge': '📚', 'Mathematics': '🔢',
      'Science': '🔬', 'English': '🇬🇧', 'History': '🏛️',
      'Geography': '🌍', 'Computer': '🖥️', 'Physics': '⚛️',
      'Chemistry': '🧪', 'Biology': '🧬', 'Current Affairs': '📰',
    };
    const key = Object.keys(map).find(k => name?.toLowerCase().includes(k.toLowerCase()));
    return key ? map[key] : '📊';
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
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Ready to test your <span className="text-gradient">knowledge</span>?
          </h1>
          <p className="home-hero-subtitle">
            Choose a category below and challenge yourself with our curated quizzes.
          </p>
        </div>
      </div>

      {/* Quiz Categories */}
      <main className="home-main">
        <div className="home-grid">
          {types.map((type, idx) => (
            <div
              className="quiz-card"
              key={type.id}
              style={{ '--card-accent': getCardAccent(idx), animationDelay: `${idx * 0.08}s` }}
            >
              <div className="quiz-card-accent"></div>
              <div className="quiz-card-emoji">{getCategoryEmoji(type.name)}</div>
              <h3 className="quiz-card-title">{type.name}</h3>
              <p className="quiz-card-desc">
                Practice questions and test your skills in <strong>{type.name}</strong>.
              </p>
              <Link to={`/quiz/${type.id}`} className="quiz-card-btn" id={`quiz-type-${type.id}`}>
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
            <p>Loading quizzes...</p>
          </div>
        )}
      </main>
    </>
  );
}

export default Home;
