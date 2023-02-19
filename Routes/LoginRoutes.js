const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
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
        return res.status(422).send({error: "Please fill in all fields"});
        
    }
    const savedUser = await User.findOne({ email : email});
   //const freelancer = await Freelancer.findOne({ user: savedUser});
    //const recruiter = await Recruiter.findOne({ user: savedUser});


    if (!savedUser){
                    
        return res.status(422).send({error:"Invalid Credentials"});
                    
    }
    try{
            bcrypt.compare(password,savedUser.password,(err, result) =>{
            if(result){

                console.log("password matched");
                const token = jwt.sign({_id: savedUser._id}, process.env.jwt_secret);
                //res.send({token});
                const { _id, username, email, type ,first_name,last_name} = savedUser;
            
                res.json({ message: "Login Successful", token, user: { _id, username, email,type ,first_name,last_name} });
                //res.redirect(`/freelancerprofile/${savedUser._id}`);
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

        //res.redirect(`/Freelancerprofile/${req.userdata._id}`); 
    
})

module.exports = router;