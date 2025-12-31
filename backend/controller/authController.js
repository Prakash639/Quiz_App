const User = require('../models/model');
const jwt = require("jsonwebtoken");
const secret = "your_jwt_secret";

exports.sample = (req, res) =>{
    res.send("hello dsrt");
};
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const userData = [name, email, password];

  User.register(userData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Registered successfully", result });
  });
};

exports.login = (req, res) => {
  const {  email, password } = req.body;

  const userData = [ email, password];
    if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  
  User.login(userData, (err, result) => {
     if (err) return res.status(500).json({ error: err.message });

       if (result.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user=result[0];
     if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }
        // ✅ Generate JWT with user ID
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });




   return res.status(200).json({ message: "Login successful", token });
  });

};
exports.home = (req, res) => {

  User.home( (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "successfully", result });
  });
};
exports.quiz = (req, res) => {
  const id=req.params.id;
  User.quiz(id,(err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: " successfully", result });
  });
};


  exports.ques = (req, res) => {
  const id = req.params.id;

  User.ques(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Group options under their question
    const grouped = {};
    results.forEach(row => {
      const qid = row.question_id;

      if (!grouped[qid]) {
        grouped[qid] = {
          id: qid,
          ques_name: row.ques_name,
          options: []
        };
      }

      grouped[qid].options.push({
          option_id: row.option_id,
        text: row.options_text,
        is_correct: row.is_correct === 1
      });
    });

    const formatted = Object.values(grouped);
    res.status(200).json({ message: "successfully", result: formatted });
  });
};

exports.submitAnswerAndResult = (req, res) => {
  const user_id = req.user.id;
  const {
    question_id,
    selected_option_id,
    sub_categories_id,
    isLast,
    correct_ans,
    total_ques,
    time,
  } = req.body;

  if (!question_id || !selected_option_id || !sub_categories_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ✅ This helper only inserts answer, and triggers a callback — it never sends res
  const insertAnswer = (attempt_id = null, callback = () => {}) => {
    const data = [user_id, question_id, selected_option_id, sub_categories_id, attempt_id];
    User.submitAnswer(data, callback);
  };

  if (!isLast) {
    // ➤ Insert answer without attempt_id
    insertAnswer(null, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save answer" });
      }
      return res.status(200).json({ message: "Answer submitted successfully" });
    });
  } else {
    // ➤ Last question: create result and update previous answers
    if (correct_ans == null || total_ques == null) {
      return res.status(400).json({ error: "Missing result fields" });
    }

    const percentage = parseFloat(((correct_ans / total_ques) * 100).toFixed(2));
    const resultData = [user_id, sub_categories_id, correct_ans, total_ques, percentage,time];

    User.submitResult(resultData, (err2, result2) => {
      if (err2) {
        return res.status(500).json({ error: "Failed to save result" });
      }

      const attempt_id = result2.insertId;

      // 1. Insert last answer with attempt_id
      insertAnswer(attempt_id, (err3) => {
        if (err3) {
          return res.status(500).json({ error: "Failed to save final answer" });
        }

        // 2. Update previous unanswered rows (non-blocking)
        User.updatePreviousAnswers([attempt_id, user_id, sub_categories_id], (err4) => {
          if (err4) {
            console.error("Failed to update previous answers:", err4);
          }
        });

        // ✅ Return response just once
        return res.status(200).json({
          message: "Final answer and result submitted",
          attempt_id,
        });
      });
    });
  }
};


exports.getUserProfile = (req, res) => {
  const user_id = req.params.id;

  User.getUserProfileResults(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch profile data" });
    }
    res.json({ results });
  });
};

exports.review = (req, res) => {
  const user_id = req.params.user_id;
  const attempt_id = req.params.attempt_id;

  const data = [user_id, attempt_id];

  User.review(data, (err, results) => {
    if (err) {
      //console.error("SQL Error:", err);
      return res.status(500).json({ error: "Failed to fetch review data" });
    }
    res.json({ results });
  });
};



