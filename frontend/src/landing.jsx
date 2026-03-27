import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, BookOpen, BarChart3, ChevronRight, Layout } from 'lucide-react';
import './landing.css';

function Landing() {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="landing-brand">
                    <Sparkles size={28} color="var(--primary)" />
                    <span>QuizMaster</span>
                </div>
                <div className="landing-nav-links">
                    <Link to="/login" className="landing-nav-link">Login</Link>
                    <Link to="/register" className="landing-nav-btn">Get Started</Link>
                </div>
            </nav>

            <header className="landing-hero">
                <motion.div 
                    className="landing-hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div 
                        className="landing-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        ✨ The new standard in interactive learning
                    </motion.div>
                    <h1 className="landing-title">
                        Master Any Subject with <br />
                        <span className="text-gradient">Intelligent Quizzes</span>
                    </h1>
                    <p className="landing-subtitle">
                        Challenge yourself with our library of curated quizzes.
                        Track progress, identify strengths, and learn faster.
                    </p>

                    <div className="landing-cta-group">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/register" className="landing-cta-primary">
                                Start Quizzing Now
                                <ChevronRight size={24} />
                            </Link>
                        </motion.div>
                        <Link to="/login" className="landing-cta-secondary">
                            I already have an account
                        </Link>
                    </div>
                </motion.div>
            </header>

            <section className="landing-features">
                <div className="landing-features-header">
                    <h2>Why Choose QuizMaster?</h2>
                    <p>Everything you need to accelerate your learning journey</p>
                </div>

                <motion.div 
                    className="landing-features-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }
                        }
                    }}
                >
                    {[
                        { 
                            icon: BookOpen, 
                            title: "Diverse Categories", 
                            desc: "Explore thousands of questions across 15+ specialized categories.",
                            color: "var(--primary)"
                        },
                        { 
                            icon: Layout, 
                            title: "Instant Feedback", 
                            desc: "Get immediate results with detailed breakdowns and answer reviews.",
                            color: "var(--accent)"
                        },
                        { 
                            icon: BarChart3, 
                            title: "Smart Analytics", 
                            desc: "Track your learning curve with an advanced progress dashboard.",
                            color: "var(--warning)"
                        }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            className="feature-card"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="feature-icon" style={{ '--icon-color': feature.color }}>
                                <feature.icon size={32} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <footer className="landing-footer">
                <div className="landing-footer-content">
                    <div className="landing-brand">
                        <Sparkles size={20} color="var(--primary)" />
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
