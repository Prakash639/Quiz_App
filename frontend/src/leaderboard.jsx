import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Search, ChevronDown, User } from "lucide-react";
import "./leaderboard.css";


function Leaderboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("score");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`);
                if (!response.ok) throw new Error("Failed to fetch leaderboard");
                const data = await response.json();
                
                const results = data.results || [];
                
                // Map backend data to frontend format
                const formattedData = results.map((user, index) => ({
                    id: user.id,
                    name: user.name || "Anonymous",
                    username: `@${user.name?.toLowerCase().replace(/\s/g, "_") || "user" + user.id}`,
                    completed: user.completed || 0,
                    score: user.total_score || 0,
                    percentage: parseFloat(user.avg_percentage || 0).toFixed(1),
                    avatar: ["👨‍💻", "👩‍🔬", "👨‍🎓", "👩‍🎨", "👨‍✈️", "👩‍⚕️", "👨‍🚒", "👩‍💼"][index % 8]
                }));

                let filtered = formattedData.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                );

                filtered.sort((a, b) => {
                    if (sortBy === "score") return b.score - a.score;
                    if (sortBy === "percentage") return b.percentage - a.percentage;
                    if (sortBy === "completed") return b.completed - a.completed;
                    return 0;
                });

                setLeaderboardData(filtered);
                setError(null);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Could not load leaderboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [searchTerm, sortBy]);

    const showPodium = searchTerm === "" && leaderboardData.length >= 3;
    const topThree = showPodium ? leaderboardData.slice(0, 3) : [];
    const others = showPodium ? leaderboardData.slice(3) : leaderboardData;

    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header-section">
                <h1 className="leaderboard-title">Global Leaderboard</h1>
                <p className="leaderboard-subtitle">The top minds currently dominating the arena.</p>
            </header>

            {/* Podium for Top 3 */}
            {showPodium && (
                <div className="podium-container">
                    {/* 2nd Place */}
                    <motion.div 
                        className="podium-item second"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="podium-card">
                            <div className="podium-rank-badge">2</div>
                            <div className="podium-avatar">{topThree[1]?.avatar}</div>
                            <h3 className="podium-name">{topThree[1]?.name}</h3>
                            <p className="podium-username">{topThree[1]?.username}</p>
                            <div className="podium-stats">
                                <div className="podium-score">{topThree[1]?.score}</div>
                                <div className="podium-score-label">Points</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div 
                        className="podium-item first"
                        initial={{ opacity: 0, y: 70 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="podium-card">
                            <div className="podium-rank-badge">
                                <Trophy size={24} />
                            </div>
                            <div className="podium-avatar">{topThree[0]?.avatar}</div>
                            <h3 className="podium-name">{topThree[0]?.name}</h3>
                            <p className="podium-username">{topThree[0]?.username}</p>
                            <div className="podium-stats">
                                <div className="podium-score">{topThree[0]?.score}</div>
                                <div className="podium-score-label">Points</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div 
                        className="podium-item third"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="podium-card">
                            <div className="podium-rank-badge">3</div>
                            <div className="podium-avatar">{topThree[2]?.avatar}</div>
                            <h3 className="podium-name">{topThree[2]?.name}</h3>
                            <p className="podium-username">{topThree[2]?.username}</p>
                            <div className="podium-stats">
                                <div className="podium-score">{topThree[2]?.score}</div>
                                <div className="podium-score-label">Points</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Controls: Search and Sort */}
            <div className="leaderboard-controls">
                <div className="search-wrap">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search top performers..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="select-wrap">
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="score">Highest Score</option>
                        <option value="percentage">Success Rate</option>
                        <option value="completed">Total Quizzes</option>
                    </select>
                </div>
            </div>

            {/* Main Rankings Table */}
            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Quizzes</th>
                            <th>Score</th>
                            <th>Avg %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div className="loading-spinner">Loading leaderboard...</div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4d' }}>
                                    {error}
                                </td>
                            </tr>
                        ) : (searchTerm !== "" ? leaderboardData : others).map((user, index) => {
                            const actualRank = (searchTerm !== "" || !showPodium) ? index + 1 : index + 4;
                            const isCurrentUser = user.id.toString() === currentUserId;

                            return (
                                <motion.tr 
                                    key={user.id} 
                                    className={isCurrentUser ? "my-rank-row" : ""}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <td className="rank-td">
                                        #{actualRank}
                                        {isCurrentUser && <span className="my-rank-indicator">YOU</span>}
                                    </td>
                                    <td>
                                        <div className="user-td">
                                            <div className="user-avatar-sm">{user.avatar}</div>
                                            <div className="user-name-info">
                                                <h4>{user.name}</h4>
                                                <span>{user.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.completed}</td>
                                    <td className="score-td">{user.score.toLocaleString()}</td>
                                    <td>
                                        <span className="pct-badge">{user.percentage}%</span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {!loading && !error && leaderboardData.length === 0 && (
                    <div className="empty-state-card" style={{ padding: '3rem' }}>
                        <div className="empty-icon">🔎</div>
                        <h3>No users found</h3>
                        <p>Try adjusting your search to find other players.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
