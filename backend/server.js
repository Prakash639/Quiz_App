const express=require("express");
const app=express();
const userRoutes = require('./Routes/authRoutes');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/',userRoutes);

const port = process.env.PORT || 4000;

app.listen(port,()=>
console.log(`Server running on port ${port}`));