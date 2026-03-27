import { useState, useEffect } from "react";

function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // On first mount, apply saved theme
    useEffect(() => {
        const saved = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
        >
            <div className={`theme-toggle-track ${theme}`}>
                <span className="theme-toggle-icon sun">☀️</span>
                <span className="theme-toggle-icon moon">🌙</span>
                <div className="theme-toggle-thumb" />
            </div>
        </button>
    );
}

export default ThemeToggle;
