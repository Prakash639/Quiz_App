import { Routes, Route, Router } from 'react-router-dom';
import Login from './login.jsx';
import Register from './register.jsx';
import Home from './home.jsx';
import Quiz from './quiz.jsx';
import Ques from './ques.jsx';
import Logout from './logout.jsx';
import Profile from './profile.jsx';
import Review from './review.jsx';
// import Dashboard from './admin/dashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/quiz/:id" element={<Quiz />} />
      <Route path="/ques/:id" element={<Ques />} />
      <Route path="/profile/:id" element={<Profile />} />
     <Route path="/review/:user_id/:attempt_id" element={<Review />} />
 {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    
    </Routes> 
  );
}

export default App;
