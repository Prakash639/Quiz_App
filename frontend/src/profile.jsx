import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user_id = localStorage.getItem("userId") || id;

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
    if (score >= 90) return { level: "Excellent", color: "var(--success)", icon: "🏆" };
    if (score >= 75) return { level: "Good", color: "var(--warning)", icon: "⭐" };
    if (score >= 60) return { level: "Average", color: "var(--primary-light)", icon: "👍" };
    return { level: "Needs Improvement", color: "var(--danger)", icon: "📈" };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Programming": "💻", "Aptitude": "🧮", "Reasoning Ability": "🧠",
      "Verbal Ability": "📝", "General Knowledge": "📚", "Mathematics": "🔢",
      "Science": "🔬"
    };
    return icons[category] || "📊";
  };

  if (loading) {
    return (
      <div className="ques-loading">
        <div className="ques-loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* Bento Stats Grid */}
      <div className="bento-grid">
        <div className="bento-item stat-card primary" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-inner">
            <div className="stat-header">
              <span className="stat-icon">🎯</span>
              <span className="stat-trend positive">+2 this week</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{userStats.totalQuizzes}</h3>
              <p className="stat-label">Quizzes Completed</p>
            </div>
          </div>
        </div>

        <div className="bento-item stat-card info" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-inner">
            <div className="stat-header">
              <span className="stat-icon">📊</span>
              <span className="stat-trend positive">Above Avg</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{userStats.averageScore}%</h3>
              <p className="stat-label">Average Score</p>
            </div>
          </div>
        </div>

        <div className="bento-item stat-card success" style={{ animationDelay: '0.3s' }}>
          <div className="stat-card-inner">
            <div className="stat-header">
              <span className="stat-icon">🏆</span>
              <span className="stat-label-badge">Peak Perf</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{userStats.bestScore}%</h3>
              <p className="stat-label">Best Performance</p>
            </div>
          </div>
        </div>

        <div className="bento-item performance-card" style={{ animationDelay: '0.4s' }}>
          <div className="perf-header">
            <h3>Rank Status</h3>
            <span className="rank-badge">{getPerformanceLevel(userStats.averageScore).level}</span>
          </div>
          <div className="rank-progress">
            <div className="rank-info">
              <span className="rank-icon">{getPerformanceLevel(userStats.averageScore).icon}</span>
              <p>Keep up the great work! You're in the top 15% of users.</p>
            </div>
            <div className="rank-bar-wrap">
              <div className="rank-bar-fill" style={{ width: `${userStats.averageScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="dashboard-sections">
        {/* Quiz History */}
        <section className="dashboard-section history-section">
          <div className="section-header">
            <h2>Quiz History</h2>
            <Link to="/home" className="section-link">View All</Link>
          </div>

          {results.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">📂</div>
              <h3>No activity yet</h3>
              <p>Start your first quiz to track your progress.</p>
              <button className="cta-btn-sm" onClick={() => navigate('/home')}>Start Now</button>
            </div>
          ) : (
            <div className="history-list">
              {results.slice(0, 5).map((result, index) => {
                const performance = getPerformanceLevel(result.percentage);
                return (
                  <div key={index} className="history-item" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <div className="h-item-info">
                      <div className="h-item-icon">{getCategoryIcon(result.name)}</div>
                      <div className="h-item-text">
                        <h4>{result.name}</h4>
                        <span>Category • {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="h-item-score">
                      <div className="score-badge" style={{ '--bg-color': performance.color }}>
                        {result.percentage}%
                      </div>
                      <p className="score-desc">{performance.level}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Actions & Insights */}
        <aside className="dashboard-content-aside">
          <section className="dashboard-section aside-section">
            <div className="section-header">
              <h2>Quick Start</h2>
            </div>
            <div className="quick-start-grid">
              {['Programming', 'Aptitude'].map((cat, idx) => (
                <button key={idx} className="quick-start-card" onClick={() => navigate('/home')}>
                  <span className="qs-icon">{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="dashboard-section aside-section">
            <div className="section-header">
              <h2>Daily Goal</h2>
            </div>
            <div className="goal-card">
              <div className="goal-header">
                <span className="goal-progress-text">2/3 Quizzes</span>
                <span className="goal-percent">66%</span>
              </div>
              <div className="goal-bar">
                <div className="goal-bar-fill" style={{ width: '66%' }}></div>
              </div>
              <p className="goal-desc">Finish 1 more quiz today to hit your streak!</p>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

export default Profile;