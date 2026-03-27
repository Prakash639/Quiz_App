import { Link } from 'react-router-dom';
import './landing.css';

function Landing() {
    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <nav className="landing-nav">
                <div className="landing-brand">
                    <div className="landing-brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <span>QuizMaster</span>
                </div>
                <div className="landing-nav-links">
                    <Link to="/login" className="landing-nav-link">Login</Link>
                    <Link to="/register" className="landing-nav-btn">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="landing-hero-bg">
                    <div className="l-shape l-shape-1"></div>
                    <div className="l-shape l-shape-2"></div>
                </div>

                <div className="landing-hero-content">
                    <div className="landing-badge">✨ The new standard in interactive learning</div>
                    <h1 className="landing-title">
                        Master Any Subject with <br />
                        <span className="text-gradient">Intelligent Quizzes</span>
                    </h1>
                    <p className="landing-subtitle">
                        Challenge yourself with our extensive library of professionally curated quizzes.
                        Track your progress, identify your strengths, and learn faster.
                    </p>

                    <div className="landing-cta-group">
                        <Link to="/register" className="landing-cta-primary">
                            Start Quizzing Now
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/login" className="landing-cta-secondary">
                            I already have an account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="landing-features">
                <div className="landing-features-header">
                    <h2>Why Choose QuizMaster?</h2>
                    <p>Everything you need to accelerate your learning journey</p>
                </div>

                <div className="landing-features-grid">
                    <div className="feature-card">
                        <div className="feature-icon" style={{ '--icon-color': 'var(--primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                        </div>
                        <h3>Diverse Categories</h3>
                        <p>From Programming to General Knowledge, explore thousands of questions across 15+ specialized categories.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ '--icon-color': 'var(--success)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3>Instant Feedback</h3>
                        <p>Get immediate results with detailed performance breakdowns, time tracking, and answer reviews.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ '--icon-color': 'var(--warning)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                        <h3>Smart Analytics</h3>
                        <p>Track your learning curve with an advanced dashboard showing your strengths, weaknesses, and overall progress.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-content">
                    <div className="landing-brand">
                        <div className="landing-brand-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                        <span>QuizMaster</span>
                    </div>
                    <p className="landing-footer-text">
                        © {new Date().getFullYear()} QuizMaster Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
