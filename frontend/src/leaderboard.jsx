import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Search, ChevronDown, User } from "lucide-react";
import "./leaderboard.css";


function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState("all-time"); // today, weekly, all-time
    const [error, setError] = useState(null);
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard?timeframe=${timeframe}`);
                if (!response.ok) throw new Error("Failed to fetch leaderboard");
                const data = await response.json();
                
                const results = data.results || [];
                
                // Map backend data to frontend format
                const formattedData = results.map((user, index) => ({
                    id: user.id,
                    name: user.name || "Anonymous",
                    username: `@${user.name?.toLowerCase().replace(/\s/g, "_") || "user" + user.id}`,
                    score: user.total_score || 0,
                    accuracy: parseFloat(user.avg_accuracy || 0).toFixed(1),
                    time: formatTime(user.total_time || 0),
                    rawTime: user.total_time || 0,
                    avatar: getInitials(user.name || "Anonymous")
                }));

                setLeaderboardData(formattedData);
                setError(null);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Could not load leaderboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timeframe]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return <span className="badge-gold">🥇</span>;
        if (rank === 2) return <span className="badge-silver">🥈</span>;
        if (rank === 3) return <span className="badge-bronze">🥉</span>;
        return <span className="rank-number">#{rank}</span>;
    };

    const SkeletonRow = () => (
        <tr className="skeleton-row">
            <td><div className="skeleton skeleton-rank"></div></td>
            <td>
                <div className="skeleton-user">
                    <div className="skeleton skeleton-avatar"></div>
                    <div className="skeleton skeleton-text"></div>
                </div>
            </td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
            <td><div className="skeleton skeleton-text"></div></td>
        </tr>
    );

    return (
        <div className="leaderboard-container">
            <motion.header 
                className="leaderboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="leaderboard-title">Leaderboard</h1>
                <p className="leaderboard-subtitle">Celebrate the top performers and their achievements.</p>
            </motion.header>

            <div className="leaderboard-stats-row">
                <div className="l-stat-card">
                    <span className="l-stat-icon">👥</span>
                    <div className="l-stat-info">
                        <span className="l-stat-value">{leaderboardData.length}</span>
                        <span className="l-stat-label">Active Players</span>
                    </div>
                </div>
                <div className="l-stat-card">
                    <span className="l-stat-icon">🏆</span>
                    <div className="l-stat-info">
                        <span className="l-stat-value">{leaderboardData[0]?.score || 0}</span>
                        <span className="l-stat-label">Top Score</span>
                    </div>
                </div>
                <div className="l-stat-card">
                    <span className="l-stat-icon">✨</span>
                    <div className="l-stat-info">
                        <span className="l-stat-value">Weekly</span>
                        <span className="l-stat-label">Reset Cycle</span>
                    </div>
                </div>
            </div>

            <div className="leaderboard-tabs">
                {["today", "weekly", "all-time"].map((t) => (
                    <button 
                        key={t}
                        className={`tab-btn ${timeframe === t ? "active" : ""}`}
                        onClick={() => setTimeframe(t)}
                    >
                        {t.replace("-", " ")}
                    </button>
                ))}
            </div>

            <div className="leaderboard-card">
                <div className="l-table-wrapper">
                    <table className="l-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            ) : error ? (
                                <tr>
                                    <td colSpan="3" className="error-cell">{error}</td>
                                </tr>
                            ) : leaderboardData.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="empty-cell">No data available for this period.</td>
                                </tr>
                            ) : leaderboardData.map((user, index) => {
                                const rank = index + 1;
                                const isCurrentUser = user.id.toString() === currentUserId;
                                const maxScore = Math.max(...leaderboardData.map(u => u.score)) || 100;
                                const progress = (user.score / maxScore) * 100;

                                return (
                                    <motion.tr 
                                        key={user.id} 
                                        className={`l-row ${isCurrentUser ? "is-me" : ""} ${rank <= 3 ? `top-${rank}` : ""}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td className="u-rank-cell">
                                            {getRankBadge(rank)}
                                        </td>
                                        <td>
                                            <div className="u-info-cell">
                                                <div className="u-avatar-init">{user.avatar}</div>
                                                <div className="u-name-info">
                                                    <div className="u-name">{user.name}</div>
                                                    <div className="u-username-sm">{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="u-score-cell">
                                            <div className="score-val">{user.score.toLocaleString()}</div>
                                            <div className="score-progress-bg">
                                                <motion.div 
                                                    className="score-progress-fill" 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <motion.div 
                className="leaderboard-info-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3>How it works 🚀</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-dot"></div>
                        <p><strong>Climb the Ranks:</strong> Earn points by completing quizzes with high accuracy and speed.</p>
                    </div>
                    <div className="info-item">
                        <div className="info-dot"></div>
                        <p><strong>Stay Consistent:</strong> The leaderboard updates in real-time as you complete new challenges.</p>
                    </div>
                    <div className="info-item">
                        <div className="info-dot"></div>
                        <p><strong>Timed Resets:</strong> Weekly rankings reset every Monday at 00:00 UTC. Aim for the top spot!</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Leaderboard;
