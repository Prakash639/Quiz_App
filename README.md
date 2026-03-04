🎯 Web-Based Quiz Application

This project is a full-stack Web-Based Quiz Application built using React, Node.js, Express, and MySQL.

The application allows users to log in, attempt quizzes, submit answers question-by-question, track quiz time, and instantly view their results with performance analysis.

🚀 Features

🔐 User Authentication (Login & Registration)

📝 Category & Subcategory-based Quiz System

⏳ Countdown Timer (Auto-submit when time ends)

📊 Instant Score Calculation

💾 Stores Every Answer with attempt_id

📈 Quiz Result Summary (Score, Percentage, Time Taken)

🔍 Review Attempted Questions

🔑 Token-based Authentication (JWT)

📱 Responsive UI Design

🛠️ Tech Stack
Frontend

React.js

Axios

React Router DOM

CSS / Modern UI Design

Backend

Node.js

Express.js

JWT Authentication

Database

MySQL

📂 Project Structure
quiz-app/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
├── server/                 # Node + Express Backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── database/
    └── schema.sql
🗄️ Database Design
Main Tables:

users

categories

sub_categories

questions

options

attempts

user_answer

Each quiz attempt generates a unique attempt_id, which is stored for:

Tracking each question submission

Calculating final score

Reviewing quiz attempts

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
2️⃣ Backend Setup
cd server
npm install

Create a .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quiz_app
JWT_SECRET=your_secret_key

Start the backend:

npm start
3️⃣ Frontend Setup
cd client
npm install
npm start

Frontend will run on:

http://localhost:3000

Backend will run on:

http://localhost:5000
🔄 Quiz Flow

User logs in

Selects category & subcategory

attempt_id is created before quiz starts

Each question is submitted individually

Timer counts down from 5:00 minutes

On completion or timeout:

Final score is calculated

Time taken is stored

Result summary is displayed

User can review answers using:

/review/:user_id/:attempt_id
📊 Result Summary Includes

Total Questions

Correct Answers

Wrong Answers

Percentage

Time Taken

Performance Message

🔐 Security

Password hashing

JWT token authentication

Protected quiz routes

Middleware validation

📌 Future Enhancements

🏆 Leaderboard

📊 Admin Dashboard

📈 Performance Analytics Graph

🌙 Dark Mode UI

📧 Email Verification

📱 Mobile App Version
