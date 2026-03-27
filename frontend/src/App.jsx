import { Routes, Route } from 'react-router-dom';
import Landing from './landing.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import Home from './home.jsx';
import Quiz from './quiz.jsx';
import Ques from './ques.jsx';
import Logout from './logout.jsx';
import Profile from './profile.jsx';
import Review from './review.jsx';
import DashboardLayout from './DashboardLayout.jsx';
import Leaderboard from './leaderboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/ques/:id" element={<Ques />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/review/:user_id/:attempt_id" element={<Review />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
