const express=require("express");
const app=express();
const userRoutes = require('./Routes/authRoutes');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/',userRoutes);

app.listen(4000,()=>
console.log("connected"));