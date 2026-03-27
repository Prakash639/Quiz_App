require('dotenv').config();
const mysql=require("mysql");
const isLocal = !process.env.DB_HOST || 
               process.env.DB_HOST === 'localhost' || 
               process.env.DB_HOST === '127.0.0.1';

const db=mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quiz',
    ssl: (process.env.DB_SSL === 'true' || !isLocal) ? { 
        minVersion: 'TLSv1.2', 
        rejectUnauthorized: true 
    } : undefined
});
db.connect((err)=>{
    if(err) throw err;
    console.log("connect mysql");
})
module.exports = db;