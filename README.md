🎯 Web-Based Quiz Application

This project is a full-stack Web-Based Quiz Application built using React, Node.js, Express, and MySQL. The application allows users to log in, attempt quizzes, submit answers question-by-question, track quiz time, and instantly view their results with performance analysis.

🚀 Features

User Registration and Login

Category & Subcategory-Based Quiz System

Countdown Timer with Auto-Submission

Instant Score Calculation

Stores Every Answer with Attempt ID

Quiz Result Summary (Score, Percentage, Time Taken)

Review Attempted Questions

JWT-Based Authentication

Responsive Modern UI

🛠️ Tech Stack

Frontend:

React.js

Axios

React Router DOM

CSS

Backend:

Node.js

Express.js

JWT Authentication

Database:

MySQL

📂 Project Structure

quiz-app/
│
├── client/ (React Frontend)
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── App.js
│
├── server/ (Node + Express Backend)
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ └── server.js
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

Each quiz attempt generates a unique attempt_id. This ID is used to track each submitted answer, calculate the final score, and allow users to review their attempts later.

⚙️ Installation & Setup

Clone the repository
git clone https://github.com/your-username/quiz-app.git

cd quiz-app

Backend Setup
cd server
npm install

Create a .env file with:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quiz_app
JWT_SECRET=your_secret_key

Start backend:
npm start

Frontend Setup
cd client
npm install
npm start

Frontend runs on:
http://localhost:3000

Backend runs on:
http://localhost:5000

🔄 Quiz Flow

User logs in

Selects category and subcategory

Attempt ID is created before quiz starts

Each question is submitted individually

Timer starts (5 minutes countdown)

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

Password Hashing

JWT Token Authentication

Protected Routes

Middleware Validation

📌 Future Enhancements

Leaderboard System

Admin Dashboard

Performance Analytics

Dark Mode

Email Verification

Mobile App Version
