import { useEffect, useState } from "react";
import "./quiz.css";
import { Link, useParams } from "react-router-dom";

function Quiz() {
  const [types, setTypes] = useState([]);
  const { id } = useParams(); // get dynamic ID from URL

  useEffect(() => {
    fetch(`http://localhost:4000/quiz/${id}`) // ✅ correct use of ID
      .then((res) => res.json())
      .then((data) => setTypes(data.result))
      .catch((err) => console.error("Failed to fetch quiz types:", err));
  }, [id]);

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
    <div className="home-container">
      <main className="main-content">
        <section className="content-sections">
          {types.map((type) => (
            <div className="section-card" key={type.id}>
              <h3>{type.name}</h3>
              <p>
                Practice questions and test your skills in{" "}
                <strong>{type.name}</strong>.
              </p>
              <Link
                to={`/ques/${type.id}`} // example route for questions
                className="section-link"
              >
                Start {type.name} →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div></div>
  );
}

export default Quiz;
