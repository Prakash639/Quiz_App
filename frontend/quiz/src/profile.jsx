import { useEffect, useState } from "react";
import { useParams,Link,useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(localStorage.getItem("attemptId") || null);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    userName: "User"
  });
  const [userName, setUserName] = useState("");
  const { id } = useParams();
   const user_id = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Try to get username from multiple sources
    const storedUserName = localStorage.getItem("userName") || 
                          localStorage.getItem("username") || 
                          localStorage.getItem("user") || 
                          sessionStorage.getItem("userName") ||
                          sessionStorage.getItem("username") ||
                          "User";
    
    setUserName(storedUserName);
    setLoading(true);
    
    fetch(`http://localhost:4000/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.results)) {
          setResults(data.results);
          
          // Try to get username from API response first
          const apiUserName = data.results.length > 0 ? data.results[0].username : null;
          const finalUserName = apiUserName || storedUserName;
          setUserName(finalUserName);
          
          // Calculate user statistics
          const totalQuizzes = data.results.length;
          const scores = data.results.map(r => r.percentage);
          const averageScore = scores.length > 0 ? 
            (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : 0;
          const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
          
          setUserStats({
            totalQuizzes,
            averageScore,
            bestScore,
            userName: finalUserName
          });
        } else {
          console.error("Invalid response:", data);
          setResults([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch results", err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: "Excellent", color: "#059669", icon: "🏆" };
    if (score >= 75) return { level: "Good", color: "#D97706", icon: "⭐" };
    if (score >= 60) return { level: "Average", color: "#7C3AED", icon: "👍" };
    return { level: "Needs Improvement", color: "#DC2626", icon: "📈" };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Programming": "💻",
      "Aptitude": "🧮",
      "Reasoning Ability": "🧠",
      "Verbal Ability": "📝",
      "General Knowledge": "📚",
      "Mathematics": "🔢",
      "Science": "🔬"
    };
    return icons[category] || "📊";
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "#059669";
    if (score >= 75) return "#D97706";
    if (score >= 60) return "#7C3AED";
    return "#DC2626";
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div class="profile_body">
            <div>
               <nav className="navbar">
        <div className="logo">Ready to test your knowledge</div>
        <ul className="nav-links">
   <li><Link to={`/profile/${localStorage.getItem("userId")}`}>Dashboard</Link></li>
    <li><a href="/home">Quizzes</a></li>
    {/* <li><a href="">Rank</a></li> */}
     <li><a href="/logout">logout</a></li>
  </ul>

      </nav>
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {userName.toUpperCase()  || "User"}
          </h1>
          <p className="profile-subtitle">Quiz Performance Dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">{userStats.totalQuizzes}</h3>
            <p className="stat-label">Quizzes Taken</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{userStats.averageScore}%</h3>
            <p className="stat-label">Average Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-number">{userStats.bestScore}%</h3>
            <p className="stat-label">Best Score</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-number">{getPerformanceLevel(userStats.averageScore).level}</h3>
            <p className="stat-label">Performance Level</p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="section-header">
          <h2>Quiz Results History</h2>
          <p>Your detailed performance across all categories</p>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Quiz Results Yet</h3>
            <p>Take your first quiz to see your results here!</p>
            <button className="cta-button" onClick={() => window.history.back()}>
              Start Quiz →
            </button>
          </div>
        ) : (
          <div className="results-grid">
            {results.map((result, index) => {
              const performance = getPerformanceLevel(result.percentage);
              const gradeColor = getGradeColor(result.percentage);
              
              return (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <div className="result-number">
                      <span className="quiz-badge">Quiz #{index + 1}</span>
                    </div>
                    <div className="result-date">
                      <span className="date-text">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="result-content">
                    <div className="category-section">
                      <div className="category-display">
                        <span className="category-icon-large">
                          {getCategoryIcon(result.name)}
                        </span>
                        <div className="category-text">
                          <h3 className="category-title">{result.name}</h3>
                          <p className="category-subtitle">Assessment</p>
                        </div>
                      </div>
                    </div>

                    <div className="score-section">
                      <div className="score-display">
                        <div className="score-circle" style={{ borderColor: gradeColor }}>
                          <span className="score-number" style={{ color: gradeColor }}>
                            {result.percentage}%
                          </span>
                        </div>
                        <div className="score-details">
                          <div className="performance-tag" style={{ backgroundColor: performance.color }}>
                            <span className="performance-icon">{performance.icon}</span>
                            <span className="performance-text">{performance.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${result.percentage}%`,
                            backgroundColor: gradeColor 
                          }}
                        ></div>
                      </div>
                      <div className="progress-labels">
                        <span className="progress-start">0%</span>
                        <span className="progress-end">100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="result-actions">
                     {/* {attemptId && ( */}
                {/* <button
                  className="action-btn review-btn"
                  onClick={() => navigate(`/review/${user_id}/${attemptId}`)}
                >
                  👁️ Review Quiz
                </button> */}
              {/* )} */}
                    {/* <button className="action-btn retake-btn">
                      <span className="btn-icon">🔄</span>
                      Retake
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance Insights */}
      {results.length > 0 && (
        <div className="insights-section">
          <div className="section-header">
            <h2>Performance Insights</h2>
            <p>Your strengths and areas for improvement</p>
          </div>
          
          <div className="insights-grid">
            <div className="insight-card strength-card">
              <div className="insight-icon">💪</div>
              <h3>Your Strengths</h3>
              <p>
                {results.length > 0 && 
                  results.reduce((best, current) => 
                    current.percentage > best.percentage ? current : best
                  ).name
                }
              </p>
              <span className="insight-score">
                {results.length > 0 && 
                  Math.max(...results.map(r => r.percentage))
                }% Best Score
              </span>
            </div>
            
            <div className="insight-card improvement-card">
              <div className="insight-icon">🎯</div>
              <h3>Focus Areas</h3>
              <p>
                {results.length > 0 && 
                  results.reduce((worst, current) => 
                    current.percentage < worst.percentage ? current : worst
                  ).name
                }
              </p>
              <span className="insight-score">
                {results.length > 0 && 
                  Math.min(...results.map(r => r.percentage))
                }% Needs Work
              </span>
            </div>
            
            <div className="insight-card trend-card">
              <div className="insight-icon">📈</div>
              <h3>Overall Trend</h3>
              <p>
                {userStats.averageScore >= 75 ? "Excellent Progress" : 
                 userStats.averageScore >= 60 ? "Good Progress" : "Keep Practicing"}
              </p>
              <span className="insight-score">
                {userStats.averageScore}% Average
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          ← Back to Quizzes
        </button>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          🔄 Refresh Results
        </button>
      </div>
    </div></div></div>
  );
}

export default Profile;