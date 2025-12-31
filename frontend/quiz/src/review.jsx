import React, { useEffect, useState } from "react";
import { Link,useParams, useNavigate } from "react-router-dom";
import "./review.css";

function Review() {
  const {user_id, attempt_id } = useParams();
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState([]);
  

  useEffect(() => {
    fetch(`http://localhost:4000/review/${user_id}/${attempt_id}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.results;

        // Group by question name
        const grouped = [];
        raw.forEach((item) => {
          const existing = grouped.find(g => g.ques_name === item.ques_name);
          if (existing) {
            existing.options.push(item.options);
          } else {
            grouped.push({
              ques_name: item.ques_name,
              correct_option: item.correct_option,
              selected_option: item.selected_option,
              options: [item.options],
            });
          }
        });

        setGroupedData(grouped);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, [user_id, attempt_id]);

  if (!groupedData.length) {
    return (
      <div className="review-container">
        <h2>No review data found.</h2>
        <button onClick={() => navigate("/home")}>Go Back Home</button>
      </div>
    );
  }

  return (
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
          <div className="review-container">
      <h2>Quiz Review</h2>
      {groupedData.map((item, index) => (
        <div key={index} className="review-question">
          <h4>
            Q{index + 1}. {item.ques_name}
          </h4>
          <ul className="options-list">
            {item.options.map((option, i) => {
              const isCorrect = option === item.correct_option;
              const isSelected = option === item.selected_option;

              return (
                <li
                  key={i}
                  className={`option ${isCorrect ? "correct" : ""} ${
                    isSelected && !isCorrect ? "incorrect" : ""
                  }`}
                >
                  {option}
                </li>
              );
            })}
          </ul>
          <p>
            <strong>Your Answer:</strong> {item.selected_option}
            <br />
            <strong>Correct Answer:</strong> {item.correct_option}
          </p>
        </div>
      ))}

      <button className="home-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div></div>
  );
}

export default Review;
