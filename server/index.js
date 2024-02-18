require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const UserSchema = require('./models/userModel');
const StockSchema = require('./models/stockModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { generateOTP, sendOTP } = require("./utils/otp");
 
app.use(cors());
app.use(express.json());



mongoose.connect("mongodb+srv://bamboocse042:iyz1E6PP1uyOsZe1@bamboo.3kvmdox.mongodb.net/bamboo?retryWrites=true&w=majority");

// app.listen(1111, () => {
//     console.log("server started on port 1111");
// });

app.get("/", (req, res) => {
    res.json("Hello");
})

app.get("/api/test", (req, res) => {
    res.send("Hello world");
})

app.post("/api/register", async (req,res) => {
    console.log(req);
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await UserSchema.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        res.json({status: "ok"});
    }
    catch(ex){
        res.json({status: `error: duplicate email ${ex}`});
    }
});

app.post("/api/login", async (req,res) => {
    try{
        const user = await UserSchema.findOne({
            email: req.body.email,
        });

        if(!user){
            return res.json({status: "error", error: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if(isPasswordValid){
            const token = jwt.sign({
                name: user.name,
                email: user.email,
            },
            "secret123");
            return res.json({status: "ok", user: token});
        }
        else{
            res.json({status: "ok", user: "false"});
        }
    }
    catch(ex){
        res.json({status: `error: duplicate email ${ex}`});
    }
    console.log(req);
});

app.get("/api/verifyToken", async (req,res) => {

    const token = req.headers["x-access-token"];
    try{
        const decoded = jwt.verify(token, "secret123");
        const email = decoded.email;
        const user = await UserSchema.findOne({email: email});

        return res.json({ status: "ok"});
    }
    catch(ex){
        res.json({status: `error`, error: `invalid token ${ex}`});
    }
    console.log(req);
});

app.post("/api/generateOtp", async (req, res) => {
    const email = req.body.email;
    // const email = "sanskriti.hedaoo@gmail.com";

    try {
        let user = await UserSchema.findOne({ email: email });
    
        // If user does not exist, create a new user
        if (!user) {
          user = new UserSchema({ email: email, password: "abc", name: "testUser" });
        }
    
        const OTP = generateOTP();
        user.OTP = OTP;
    
        await user.save();
    
        sendOTP(email, OTP);
    
        res.json({status: "ok"});
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
});

app.post("/api/verifyOtp", async (req,res) => {
    const email = req.body.email;
    const OTP = req.body.otp;
    console.log(OTP);
    try {
        const user = await UserSchema.findOne({ email: email });
    
        if (!user) {
          return res.status(404).send("User not found");
        }
    
        if (user.OTP !== OTP) {
          return res.status(403).send({status: "error", error: "Invalid OTP"});
        }
    
        // Clear OTP
        user.OTP = undefined;
        user.emailVerified = true;
        await user.save();

        res.json({ status: "ok" });
        console.log("User logged in successfully");
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
});

app.post("/api/addStock", async (req, res) => {
    const stockCode = req.body.stockCode;
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "secret123");
    const userEmail = decoded.email;

    console.log(stockCode, userEmail);
    try {
        const user = await UserSchema.findOne({ email: userEmail });
        if(user.stocksList.includes(stockCode)===false){
            user.stocksList.push(stockCode);
            user.save();
        }

        const stock = await StockSchema.findOne({code: stockCode});
        if(stock.usersList.includes(userEmail) === false){
            stock.usersList.push(userEmail);
            stock.save();
        }
        res.json({status: "ok"});
    }
    catch(ex) {
        res.json({status: "error", error: `An error occured : ${ex}`});
    }
});

app.post("/api/removeStock", async (req, res) => {
    const stockCode = req.body.stockCode;
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "secret123");
    const userEmail = decoded.email;

    console.log(stockCode, userEmail);
    try {
        const user = await UserSchema.findOne({ email: userEmail });
        const stockIndex = user.stocksList.indexOf(stockCode);
        if(stockIndex>-1){
            user.stocksList.splice(stockIndex);
            user.save();
        }

        const stock = await StockSchema.findOne({code: stockCode});
        const userIndex = stock.usersList.indexOf(userEmail);
        if(userIndex>-1){
            stock.usersList.splice(userIndex);
            stock.save();
        }
        res.json({status: "ok"});
    }
    catch(ex) {
        res.json({status: "error", error: `An error occured : ${ex}`});
    }
});

app.post("/api/fetchUsersSubscriptions", async (req, res) => {
    const token = req.headers["x-access-token"];
    try{
        const decoded = jwt.verify(token, "secret123");
        const email = decoded.email;
        const user = await UserSchema.findOne({email: email});
        const subscriptionList = user.stocksList;
        return res.json({ status: "ok", subscriptionList: subscriptionList});
    }
    catch(ex){
        res.json({status: `error`, error: ` ${ex}`});
    }
    console.log(req);
});

app.post("/api/fetchAllStocks", async (req, res) => {
    try{
        const stocksList = await StockSchema.find({}, {code: 1, _id: 0});
        return res.json({ status: "ok", stocksList: stocksList});
    }
    catch(ex){
        res.json({status: `error`, error: `${ex}`});
    }
    console.log(req);
});