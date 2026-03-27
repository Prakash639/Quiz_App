
import { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function Home() {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId);

  useEffect(() => {
    // Fetch quiz types from backend
    fetch(`${import.meta.env.VITE_API_URL}/home`)
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
        <motion.div 
          className="home-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {types.map((type, idx) => {
            const accent = getCardAccent(idx);
            return (
              <motion.div
                className="quiz-card"
                key={type.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.02 }}
                style={{ '--card-accent': accent }}
              >
                <div className="quiz-card-emoji">{getCategoryEmoji(type.name)}</div>
                <div className="quiz-card-content">
                  <h3 className="quiz-card-title">{type.name}</h3>
                  <p className="quiz-card-desc">
                    Practice questions and test your skills in <strong>{type.name}</strong>.
                  </p>
                </div>
                <motion.div className="quiz-card-btn-wrap" whileTap={{ scale: 0.95 }}>
                  <Link to={`/quiz/${type.id}`} className="quiz-card-btn" id={`quiz-type-${type.id}`}>
                    Start Quiz
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {types.length === 0 && (
          <div className="home-empty">
            <motion.div 
              className="home-empty-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              📋
            </motion.div>
            <p>Loading quizzes...</p>
          </div>
        )}
      </main>
    </>
  );
}

export default Home;
