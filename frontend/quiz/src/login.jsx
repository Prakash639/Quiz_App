import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './login.css'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ correct import


function App() {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const navigate = useNavigate(); 

const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || 'Login failed');
    return;
  }

  alert(data.message || 'Login successful');

  const ADMIN_EMAIL = "admin@gmail.com"; 
if (email === ADMIN_EMAIL) {
  navigate("/dashboard");
  return;
}
  // Save token
  localStorage.setItem("token", data.token);

  // ✅ Decode the token to get userId
  const decoded = jwtDecode(data.token);
  console.log("Decoded token:", decoded); // ✅ should include { id: ... }
  localStorage.setItem("userId", decoded.id); // ✅ store actual user ID
const user_id = localStorage.getItem("userId");
navigate(`/profile/${user_id}`);

};

  
  return (
    <div class="login1">
    <form class='login'onSubmit={handleSubmit}>
      <h1>Login</h1>
   <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
       <label>password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <input type="submit" value="Submit" />
       <a href="/">Don't have account? Click Here</a>
    </form></div>
  );
}

export default App;