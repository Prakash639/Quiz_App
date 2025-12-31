
// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "./ques.css";

// function Ques() {
//   const { id } = useParams(); // sub_category ID
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [attemptId, setAttemptId] = useState(localStorage.getItem("attemptId") || null);
  

//   const user_id = localStorage.getItem("userId");

//   useEffect(() => {
//     // Reset old attempt ID on quiz start
//     localStorage.removeItem("attemptId");
//     setAttemptId(null);

//     fetch(`http://localhost:4000/ques/${id}`)
//       .then((res) => res.json())
//       .then((data) => setQuestions(data.result))
//       .catch((err) => console.error("Fetch error:", err));
//   }, [id])

//   const currentQ = questions[currentIndex];

//   const handleSubmit = async () => {
//     if (selectedIndex === null) return;

//     const selectedOption = currentQ.options[selectedIndex];
//     const isCorrect = selectedOption.is_correct;

//     setSubmitted(true);

//     let tempScore = score;
//     if (isCorrect) tempScore += 1;
//     setScore(tempScore);

//     const isLast = currentIndex + 1 === questions.length;

//     try {
//       const body = {
//         question_id: currentQ.id,
//         selected_option_id: selectedOption.option_id,
//         sub_categories_id: parseInt(id),
//         user_id,
//         attempt_id: attemptId , // will be null on first submission
//       };

//       if (isLast) {
//         body.isLast = true;
//         body.correct_ans = tempScore;
//         body.total_ques = questions.length;
//         body.attempt = 1;
//       }

//       const res = await fetch(`http://localhost:4000/ques/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Answer not submitted");

//       // Set and save attempt ID after first question
//       if (data.attempt_id && !attemptId) {
//         setAttemptId(data.attempt_id);
//         localStorage.setItem("attemptId", data.attempt_id);
//       }

//       if (isLast) {
//         setShowScore(true);
       
//       }
//     } catch (error) {
//       console.error("Answer submission error:", error.message);
//     }
//   };

//   const handleNext = () => {
//     setSelectedIndex(null);
//     setSubmitted(false);
//     setCurrentIndex((prev) => prev + 1);
//   };

//   // const handleLogout = () => {
//   //   localStorage.clear();
//   //   navigate("/login");
//   // };

//   if (!currentQ && !showScore) return <div>Loading...</div>;

//   if (showScore) {
//     const percentage = ((score / questions.length) * 100).toFixed(2);
//     const performanceMessage =
//       percentage === "100.00"
//         ? "🏆 Outstanding! You nailed every question!"
//         : percentage >= 75
//         ? "👏 Great job! You're well on your way."
//         : percentage >= 50
//         ? "👍 Good effort! A little more practice and you'll master it."
//         : "💡 Keep going! Practice makes perfect.";

//     return (
//       <div>
//         <nav className="navbar">
//           <div className="logo">Ready to test your knowledge</div>
//           <ul className="nav-links">
//             <li><Link to={`/profile/${user_id}`}>Dashboard</Link></li>
//             <li><a href="/home">Quizzes</a></li>
//              <li><a href="/logout">logout</a></li>
//           </ul>
//         </nav>

//         <div className="quiz-result">
//           <div className="result-card1">
//             <h2 className="result-title">Quiz Summary</h2>
//             <div className="score-display">
//               <div className="circle-score">
//                 <span>{percentage}%</span>
//               </div>
//               <div className="score-details">
//                 <p><strong>Correct Answers:</strong> {score} / {questions.length}</p>
//                 <p>{performanceMessage}</p>
//               </div>
//             </div>

//             <div className="result-actions">
//               <button className="btn retry" onClick={() => window.location.reload()}>
//                 🔁 Retake Quiz
//               </button>

//               {attemptId && (
//                 <button
//                   className="btn review"
//                   onClick={() => navigate(`/review/${user_id}/${attemptId}`)}
//                 >
//                   👁️ Review Quiz
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="ques">
//       <nav className="navbar">
//         <div className="logo">Ready to test your knowledge</div>
//         <ul className="nav-links">
//           <li><Link to={`/profile/${user_id}`}>Dashboard</Link></li>
//           <li><a href="/home">Quizzes</a></li>
//               <li><a href="/logout">logout</a></li>
//         </ul>
//       </nav>

//       <div className="quiz-container">
//         <h4>Question {currentIndex + 1} of {questions.length}</h4>
//         <h3>{currentQ.ques_name}</h3>
//         <ul className="option-list">
//           {currentQ.options.map((option, idx) => {
//             let className = "option";
//             if (selectedIndex === idx) className += " selected";
//             if (submitted) {
//               if (option.is_correct) className += " correct";
//               else if (selectedIndex === idx && !option.is_correct) className += " wrong";
//             }

//             return (
//               <li
//                 key={idx}
//                 className={className}
//                 onClick={() => !submitted && setSelectedIndex(idx)}
//               >
//                 {option.text}
//               </li>
//             );
//           })}
//         </ul>

//         {!submitted ? (
//           <button onClick={handleSubmit} disabled={selectedIndex === null}>
//             Submit
//           </button>
//         ) : (
//           <button onClick={handleNext}>
//             {currentIndex + 1 === questions.length ? "Finish" : "Next"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Ques;

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ques.css";

function Ques() {
  const { id } = useParams(); // sub_category ID
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [attemptId, setAttemptId] = useState(localStorage.getItem("attemptId") || null);

  const [time, setTime] = useState(0); // ⏱️ Add time state
  const user_id = localStorage.getItem("userId");

  useEffect(() => {
    // Reset old attempt ID on quiz start
    localStorage.removeItem("attemptId");
    setAttemptId(null);

    fetch(`http://localhost:4000/ques/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.result))
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  useEffect(() => {
    if (!showScore) {
      const timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showScore]);

  const formatTime = (t) => {
    const mins = String(Math.floor(t / 60)).padStart(2, "0");
    const secs = String(t % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentQ = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedIndex === null) return;

    const selectedOption = currentQ.options[selectedIndex];
    const isCorrect = selectedOption.is_correct;

    setSubmitted(true);

    let tempScore = score;
    if (isCorrect) tempScore += 1;
    setScore(tempScore);

    const isLast = currentIndex + 1 === questions.length;

    try {
      const body = {
        question_id: currentQ.id,
        selected_option_id: selectedOption.option_id,
        sub_categories_id: parseInt(id),
        user_id,
        attempt_id: attemptId,
      };

      if (isLast) {
        body.isLast = true;
        body.correct_ans = tempScore;
        body.total_ques = questions.length;
        body.attempt = 1;
        body.time_taken = time; // ⏱️ Send time on final submission
      }

      const res = await fetch(`http://localhost:4000/ques/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Answer not submitted");

      if (data.attempt_id && !attemptId) {
        setAttemptId(data.attempt_id);
        localStorage.setItem("attemptId", data.attempt_id);
      }

      if (isLast) {
        setShowScore(true);
      }
    } catch (error) {
      console.error("Answer submission error:", error.message);
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentQ && !showScore) return <div>Loading...</div>;

  if (showScore) {
    const percentage = ((score / questions.length) * 100).toFixed(2);
    const performanceMessage =
      percentage === "100.00"
        ? "🏆 Outstanding! You nailed every question!"
        : percentage >= 75
        ? "👏 Great job! You're well on your way."
        : percentage >= 50
        ? "👍 Good effort! A little more practice and you'll master it."
        : "💡 Keep going! Practice makes perfect.";

    return (
      <div>
        <nav className="navbar">
          <div className="logo">Ready to test your knowledge</div>
          <ul className="nav-links">
            <li><Link to={`/profile/${user_id}`}>Dashboard</Link></li>
            <li><a href="/home">Quizzes</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>

        <div className="quiz-result">
          <div className="result-card1">
            <h2 className="result-title">Quiz Summary</h2>
            <div className="score-display">
              <div className="circle-score">
                <span>{percentage}%</span>
              </div>
              <div className="score-details">
                <p><strong>Correct Answers:</strong> {score} / {questions.length}</p>
                <p><strong>Time Taken:</strong> {formatTime(time)}</p>
                <p>{performanceMessage}</p>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn retry" onClick={() => window.location.reload()}>
                🔁 Retake Quiz
              </button>

              {attemptId && (
                <button
                  className="btn review"
                  onClick={() => navigate(`/review/${user_id}/${attemptId}`)}
                >
                  👁️ Review Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ques">
      <nav className="navbar">
        <div className="logo">Ready to test your knowledge</div>
        <ul className="nav-links">
          <li><Link to={`/profile/${user_id}`}>Dashboard</Link></li>
          <li><a href="/home">Quizzes</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>

      <div className="quiz-container">
        <div className="quiz-header">
          <span className="question-count">Question {currentIndex + 1} of {questions.length}</span>
          <span className="timer">{formatTime(time)}</span>
        </div>

        <h3>{currentQ.ques_name}</h3>
        <ul className="option-list">
          {currentQ.options.map((option, idx) => {
            let className = "option";
            if (selectedIndex === idx) className += " selected";
            if (submitted) {
              if (option.is_correct) className += " correct";
              else if (selectedIndex === idx && !option.is_correct) className += " wrong";
            }

            return (
              <li
                key={idx}
                className={className}
                onClick={() => !submitted && setSelectedIndex(idx)}
              >
                {option.text}
              </li>
            );
          })}
        </ul>

        {!submitted ? (
          <button onClick={handleSubmit} disabled={selectedIndex === null}>
            Submit
          </button>
        ) : (
          <button onClick={handleNext}>
            {currentIndex + 1 === questions.length ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Ques;

