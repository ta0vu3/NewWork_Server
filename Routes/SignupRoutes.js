const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
//
require('dotenv').config();

router.post('/signup',(req,res) =>{
    //res.send('This is signup page');
    console.log(req.body);
    const {username,first_name,last_name,email,password,confirmPassword,type} = req.body;
    if (!email || !first_name || !last_name || !password || !type || !username || !confirmPassword){
        console.log(username+email+first_name+last_name+password+confirmPassword+type);
        return res.status(422).send({error: "Please fill all fields"});
    }
    if (password!=confirmPassword){
        return res.status(422).send({error: "passwords don't match"});
    }

    User.findOne({ username : username})
        .then(
            async (savedUser) => {
                if(savedUser){
                    return res.status(422).send({error: "Username already exists"});
                }
            }
        )
    
         
    User.findOne({ email : email })
        .then(
            async (savedUser) => {
                if (savedUser) {
                    return res.status(422).send({error: "An account is already registered through this email"});
                }
                const user = new User({
                    username,
                    first_name,
                    last_name,
                    email,
                    password,
                    type
                })
                try{
                    await user.save();
                    const token = jwt.sign({_id: user._id},process.env.jwt_secret);
                    res.send({token});
                    //open profile

                }
                 catch (err) {
                       console.log('db error',err);
                       return res.status(422).send({error : err.message});
                    }

                
            }
        )




})

module.exports = router;