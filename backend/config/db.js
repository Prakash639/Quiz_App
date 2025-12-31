const mysql=require("mysql");
db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'quiz'

});
db.connect((err)=>{
    if(err) throw err;
console.log("connect mysql");
})
module.exports = db;