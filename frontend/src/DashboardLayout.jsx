import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Trophy, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronRight, 
  Calendar,
  Sparkles
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "./profile.css";

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
            fetch(`${import.meta.env.VITE_API_URL}/profile/${storedId}`, {
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
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        className="sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-brand">
                            <div className="brand-logo">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles size={24} color="var(--primary)" />
                                </motion.div>
                            </div>
                            <span>QuizMaster</span>
                            <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>


                <nav className="sidebar-nav">
                    <Link
                        to={userId ? `/profile/${userId}` : '/home'}
                        className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} className="sidebar-link-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/home" className={`sidebar-link ${isActive('/home') ? 'active' : ''}`}>
                        <Gamepad2 size={20} className="sidebar-link-icon" />
                        <span>Explore Quizzes</span>
                    </Link>
                    <Link to="/leaderboard" className={`sidebar-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                        <Trophy size={20} className="sidebar-link-icon" />
                        <span>Leaderboard</span>
                    </Link>
                    <div className="sidebar-divider"></div>
                    <Link to="/logout" className="sidebar-link logout">
                        <LogOut size={20} className="sidebar-link-icon" />
                        <span>Logout</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <motion.div 
                        className="user-profile-sm"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    >
                        <div className="user-avatar-sm">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="user-info-sm">
                            <p className="user-name-sm">{userName || "User"}</p>
                            <p className="user-status-sm">Free Member</p>
                        </div>
                    </motion.div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {/* Top Header */}
                <header className="dashboard-header">
                    <div className="header-greeting">
                        <motion.button 
                            className="sidebar-toggle-btn" 
                            onClick={() => setIsSidebarOpen(true)}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Menu size={24} />
                        </motion.button>

                        <div className="header-title-wrap">
                            <h1>{isActive('/profile') ? `Hi, ${userName}! 👋` : 'Quiz Station'}</h1>
                            <div className="header-breadcrumb">
                                <span>Dashboard</span>
                                {location.pathname !== '/home' && (
                                    <>
                                        <ChevronRight size={14} />
                                        <span>{location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <ThemeToggle />
                        <motion.button 
                            className="header-notif-btn" 
                            title="Notifications"
                            whileHover={{ rotate: 15 }}
                        >
                            <Bell size={20} />
                        </motion.button>
                        <div className="header-date">
                            <Calendar size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <motion.div 
                    className="dashboard-scroll-content"
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

export default DashboardLayout;
