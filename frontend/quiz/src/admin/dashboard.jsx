// import React, { useEffect, useState } from "react";
// import "./dashboard.css";
// import AdminNavbar from "./AdminNavbar.jsx";

// function Dashboard() {
//   const [stats, setStats] = useState({
//     users: 0,
//     categories: 0,
//     subcategories: 0,
//     quizzes: 0,
//     attempts: 0,
//     topUser: null,
//     recentAttempts: []
//   });

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:4000/admin/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       setStats(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <>
//       <AdminNavbar />

//       <div className="dashboard-container">
//         <h1 className="dashboard-title">Admin Dashboard</h1>

//         <div className="dashboard-cards">
//           <Card title="Total Users" value={stats.users} />
//           <Card title="Categories" value={stats.categories} />
//           <Card title="Subcategories" value={stats.subcategories} />
//         </div>

//         <h2 style={{ marginTop: "40px" }}>Top Performing User</h2>

//         {stats.topUser ? (
//           <div className="top-user-box">
//             <h3>{stats.topUser.name}</h3>
//             <p><b>Email:</b> {stats.topUser.email}</p>
//             <p><b>Best Score:</b> {stats.topUser.bestScore}%</p>
//             <p><b>Total Attempts:</b> {stats.topUser.attemptCount}</p>
//           </div>
//         ) : (
//           <p>No user data.</p>
//         )}

//         <div className="table-container">
//           <h2>Recent Attempts</h2>

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Category</th>
//                 <th>Subcategory</th>
//                 <th>Score</th>
//                 <th>Time Taken</th>
//               </tr>
//             </thead>

//             <tbody>
//               {stats.recentAttempts.length > 0 ? (
//                 stats.recentAttempts.map((a, i) => (
//                   <tr key={i}>
//                     <td>{a.user}</td>
//                     <td>{a.category}</td>
//                     <td>{a.subcategory}</td>
//                     <td>{a.score}%</td>
//                     <td>{a.timeTaken} sec</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5">No recent attempts found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// function Card({ title, value }) {
//   return (
//     <div className="dashboard-card">
//       <h3 className="dashboard-card-title">{title}</h3>
//       <p className="dashboard-card-value">{value}</p>
//     </div>
//   );
// }

// export default Dashboard;
