// console.log("hello js");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 80 || process.port.ENV;
const userRouter = require('./routes/users');
const AuthRouter = require('./routes/auth');
const postRoute = require('./routes/post');

app.use(express.json())

require('./Database/db');

app.use('/api/users',userRouter);
app.use('/api/auth',AuthRouter);
app.use('/api/post',postRoute);


app.listen(port,(req,res)=>{
    console.log('connected');
})