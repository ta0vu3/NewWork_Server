const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer =mongoose.model("Freelancer");
const Recruiter=mongoose.model("Recruiter");
const jwt = require("jsonwebtoken");
//
require('dotenv').config();

router.post('/signup',async(req,res) =>{
    //res.send('This is signup page');
    console.log(req.body);
    const {username,first_name,last_name,email,password,confirmpassword,type} = req.body;
    if (!email || !last_name || !password || !type || !username || !confirmpassword){
        console.log(username+email+first_name+last_name+password+confirmpassword+type);
        return res.status(422).send({error: "Please fill all fields"});
    }
    
    if (password!=confirmpassword){
        return res.status(422).send({error: "passwords don't match"});
    }
    U1=await User.findOne({ username : username});
    U2=await  User.findOne({ email : email });
    if(U1){
        return res.status(422).send({error: "Username already exists"});
    }
    else if(U2){
        return res.status(422).send({error: "An account is already registered through this email"});
           
    }

                else{ 
                const user = new User({
                    username,
                    first_name,
                    last_name,
                    email,
                    password,
                    type
                })
                await user.save();
                //user=await User.findOne({ email : email });
                user_id=user._id;
                if(type==1){
                    const freelancer=new Freelancer({
                        user_id
                    })
                    try{
                        
                        await freelancer.save();
                        const token = jwt.sign({_id: user._id},process.env.jwt_secret);
                        res.send({
                            token,
                            user,
                            freelancer,
                        });
                        //open profile
    
                    }
                     catch (err) {
                           console.log('db error',err);
                           return res.status(422).send({error : err.message});
                        }

                }
                else{
                     const recruiter= new Recruiter({
                         user_id
                     })
                     try{
                        //await user.save();
                        await recruiter.save();
                        const token = jwt.sign({_id: user._id},process.env.jwt_secret);
                        res.send({token,user,recruiter});
                        //open profile
    
                    }
                     catch (err) {
                           console.log('db error',err);
                           return res.status(422).send({error : err.message});
                        }
                }
            }
            // }
            // )
        
              

               



})

module.exports = router;