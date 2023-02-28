const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors')
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser');


dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
});

const jwtSecret = process.env.JWT_SECRET

const app = express();
app.use(express.json());

// // app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



app.get('/test', (req, res) => {
    res.json('Hello')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await User.create({ username, password })
        jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
            if (err) throw token;
            res.cookie('token', token).status(201).json({
                _id: createdUser._id
            })
        })

    }catch(err){
        // Errors cases
        if(err) throw err;
        res.status(500).json("Error")
    }
    
})

app.listen(4000, () => {
    console.log("Server Listening at Port 4000")
})