import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./profile.css"; // Reuse the professional styles

function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) setUserId(storedId);

        const storedName = localStorage.getItem("userName") ||
            localStorage.getItem("username");
        
        if (storedName) {
            setUserName(storedName);
        } else if (storedId) {
            // Fetch the user's name from the backend profile API
            const token = localStorage.getItem("token");
            fetch(`http://localhost:4000/profile/${storedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        const name = data.results[0].username;
                        setUserName(name);
                        localStorage.setItem("userName", name);
                    } else {
                        setUserName("User");
                    }
                })
                .catch(() => setUserName("User"));
        } else {
            setUserName("User");
        }

        // Auto-close sidebar on route change (mobile)
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const isActive = (path) => {
        if (path === '/profile' && location.pathname.startsWith('/profile')) return true;
        return location.pathname === path;
    };

    return (
        <div className="dashboard-container">
            {/* Professional Sidebar */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <span>QuizMaster</span>
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to={userId ? `/profile/${userId}` : '/home'}
                        className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                        <span className="sidebar-link-icon">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/home" className={`sidebar-link ${isActive('/home') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon">🎮</span>
                        <span>Explore Quizzes</span>
                    </Link>
                    <Link to="/leaderboard" className={`sidebar-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                        <span className="sidebar-link-icon">🥇</span>
                        <span>Leaderboard</span>
                    </Link>
                    <div className="sidebar-divider"></div>
                    <Link to="/logout" className="sidebar-link logout">
                        <span className="sidebar-link-icon">🚪</span>
                        <span>Logout</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile-sm">
                        <div className="user-avatar-sm">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="user-info-sm">
                            <p className="user-name-sm">{userName || "User"}</p>
                            <p className="user-status-sm">Free Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {/* Top Header */}
                <header className="dashboard-header">
                    <div className="header-greeting">
                        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div className="header-title-wrap">
                            <h1>{isActive('/profile') ? `Welcome back, ${userName}! 👋` : 'Quiz Station'}</h1>
                            <p>{isActive('/profile') ? "Here's what's happening." : "Sharpen your knowledge."}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <ThemeToggle />
                        <button className="header-notif-btn" title="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        <div className="header-date">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <div className="dashboard-scroll-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
