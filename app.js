const express = require('express');
const db_connect = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3001 ;

const app = express();
app.use(cors(corsOptions));
app.use(express.json())

db_connect();

app.use('/user', require('./routes/user'));



app.listen(PORT, ()=>{
    console.log('server start working');
})