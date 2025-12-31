
import { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate,useParams } from "react-router-dom";

function Home() {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();
   const { id } = useParams();
     const userId = localStorage.getItem("userId");
     console.log("User ID from localStorage:", userId);

  useEffect(() => {
    // Fetch quiz types from backend
    fetch("http://localhost:4000/home")
      .then((res) => res.json())
      .then((data) => setTypes(data.result)) // assuming backend sends { result: [...] }
      .catch((err) => console.error("Failed to fetch quiz types:", err));
  }, []);

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
 <div className="home-page-wrapper">
    <div className="home-container">
      <main className="main-content">
        <section className="content-sections">
          {types.map((type) => (
            <div className="section-card" key={type.id}>
              <h3>{type.type_name}</h3>
              <p>
                Practice questions and test your skills in{" "}
                <strong>{type.type_name}</strong>.
              </p>
              <Link
                
                 to={`/quiz/${type.id}`} // here we use ID to fetch subcategories
                className="section-link"
              >
                Start {type.type_name} →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div></div></div>
  );
}

export default Home;
