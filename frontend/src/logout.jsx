import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // 🔑 Clear auth token
    navigate("/login"); // 👈 Redirect to login or homepage
  }, [navigate]);

  return <p>Logging out...</p>; // Optional message
}

export default Logout;
