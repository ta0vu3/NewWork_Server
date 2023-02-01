const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//
require('dotenv').config();

router.post('/login', async(req,res) =>{
    console.log(req.body);
    const {email,password} = req.body;
    console.log(password)
    console.log(email)
    if (!email || !password){
        return res.status(422).send({error: "Please fill all fields"});
        
    }
    const savedUser = await User.findOne({ email : email});

    if (!savedUser){
                    
        return res.status(422).send({error:"Invalid Credentials"});
                    
    }
    try{
            bcrypt.compare(password,savedUser.password,(err, result) =>{
            if(result){

                console.log("password matched");
                const token = jwt.sign({_id: savedUser._id}, process.env.jwt_secret);
                res.send({token});
            }
            else{
                console.log("passwords incorrect")
                return res.status(422).json({ error: "Invalid  Credentials"});
            }

            })
        }
    catch{
        console.log(err);
        }

            
    
})

module.exports = router;