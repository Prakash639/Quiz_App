const db = require('../config/db');

const User = {
  register: (data, callback) => {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, data, callback);
  },

  login: (data, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?'; // ✅ define it here
    db.query(sql, data, callback); // ✅ now use it
  },

  home: ( callback) => {
    const sql = 'SELECT * FROM categories '; 
    db.query(sql,  callback); // ✅ now use it
  },
    quiz: ( id,callback) => {
    const sql = 'SELECT * FROM sub_categories WHERE categories_id = ?'; 
    db.query(sql, id, callback); // ✅ now use it
  },
  
ques: (id, callback) => {
  const sql = `
    SELECT 
      q.id as question_id,
      q.ques_name,
      o.id as option_id,
      o.options_text,
      o.is_correct
    FROM questions q
    JOIN options o ON q.id = o.questions_id
    WHERE q.subcategories_id = ?
  `;
  db.query(sql, [id], callback);
},

submitAnswer: (data, callback) => {
  const sql = 'INSERT INTO user_answers (user_id, question_id, selected_option_id,sub_categories_id,attempt_id) VALUES (?, ?, ?,?,?)';
  db.query(sql, data, callback);
},
submitResult: (data, callback) => {
  const sql = 'INSERT INTO result (user_id, sub_categories_id, correct_ans, total_ques, percentage,time) VALUES (?, ?, ?, ?, ?,?)';
  db.query(sql, data, callback);
},
updatePreviousAnswers: (data, callback) => {
  const sql = `
    UPDATE user_answers
    SET attempt_id = ?
    WHERE user_id = ? AND sub_categories_id = ? AND attempt_id IS NULL
  `;
  db.query(sql, data, callback);
},

getUserProfileResults: (data, callback) => {
    const sql = `SELECT u.name AS username, s.name, r.percentage FROM result r
     JOIN users u ON r.user_id = u.id
      JOIN sub_categories s ON r.sub_categories_id = s.id
      WHERE r.user_id = ?
    `;
    db.query(sql,data, callback);
  },


review: (data, callback) => {
    const sql = `SELECT q.ques_name ,o.options_text as selected_option,q.answer as correct_option,o1.options_text as options
    FROM user_answers u
      JOIN questions q ON u.question_id=q.id
      join options o on o.id=u.selected_option_id
      join options o1 on o1.questions_id=u.question_id
      WHERE u.user_id = ? and u.attempt_id=?
    `;
    db.query(sql,data, callback);
  },

  getLeaderboard: (timeframe, callback) => {
    let whereClause = "";
    if (timeframe === "today") {
      whereClause = "WHERE r.created_at >= CURDATE()";
    } else if (timeframe === "weekly") {
      whereClause = "WHERE r.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    }

    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email,
        COUNT(r.id) as completed, 
        SUM(r.correct_ans) as total_score, 
        AVG(r.percentage) as avg_accuracy,
        SUM(r.time) as total_time
      FROM users u
      LEFT JOIN result r ON u.id = r.user_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY total_score DESC
    `;
    db.query(sql, callback);
  }

};


module.exports = User;
