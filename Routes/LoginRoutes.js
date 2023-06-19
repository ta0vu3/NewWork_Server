const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");
//
//require('dotenv').config();

router.post('/login', async(req,res) =>{
    console.log(req.body);
    const {email,password} = req.body;
    console.log(password)
    console.log(email)
    if (!email || !password){
        return res.status(422).send({error: "Please fill all fields"});
        
    }
    const savedUser = await User.findOne({ email : email});
    
   //const freelancer = await Freelancer.findOne({ user: savedUser});
    //const recruiter = await Recruiter.findOne({ user: savedUser});


    if (!savedUser){
                    
        return res.status(422).send({error:"Invalid Credentials"});
                    
    }
    try{
           const freelancer = await Freelancer.findOne({ 'user_id': savedUser._id });
           const recruiter=await Recruiter.findOne({ 'user_id': savedUser._id });
            bcrypt.compare(password,savedUser.password,(err, result) =>{
            if(result){

                console.log("password matched");
                const token = jwt.sign({_id: savedUser._id}, process.env.jwt_secret);
                //res.send({token});
                const {  username, email, type ,first_name,last_name} = savedUser;
                if(freelancer && type==1){
                const{_id,user_id,skills,bio,projects,hourlyRate,rating,My_image}=freelancer
                //.populate('user');
                   
                  
                    console.log(freelancer);   
                    //const { user_id,_id, Projects,skills,rating,hourlyrate} = freelancer;
                    res.status(200).json({ message: "Login Successful", token, freelancer: {_id, user_id,My_image,hourlyRate, skills,projects ,rating,bio} ,user: {  username, email ,first_name,last_name,type} });
                }
                if(recruiter && type==2){
                    console.log(recruiter);   
                    //const { user_id,_id, Projects,skills,rating,hourlyrate} = freelancer;
                    res.status(200).json({ message: "Login Successful", token,recruiter ,user: {  username, email ,first_name,last_name,type} });
   
                }
            
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
    console.log("going out of loginroute")
        //res.redirect(`/Freelancerprofile/${req.userdata._id}`); 
    
})


async function mailer(recieveremail, code) {
    // console.log("Mailer function called");

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,

        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: process.env.NodeMailer_email, // generated ethereal user
            pass: process.env.NodeMailer_password, // generated ethereal password
        },
    });


    let info = await transporter.sendMail({
        from: "NewWork",
        to: `${recieveremail}`,
        subject: "Email Verification",
        text: `Your Verification Code is ${code}`,
        html: `<b>Your Verification Code is ${code}</b>`,
    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
router.post('/verify-email', (req, res) => {
    console.log('sent by client', req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    User.findOne({ email: email }).then(async (savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Credentials" });
        }
        try {
            let VerificationCode = Math.floor(100000 + Math.random() * 900000);
            await mailer(email, VerificationCode);
            console.log("Verification Code", VerificationCode);
            res.send({ message: "Verification Code Sent to your Email", VerificationCode, email });
        }
        catch (err) {
            console.log(err);
        }
    }
    )
})


router.put('/setNewPassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      // Find the user with the same email from the User schema
      let user = await User.findOne({ email : email});
  
      if (!user) {
        // If no user is found with the same email, return an error response
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's password
      user.password = newPassword;
  
      // Save the updated user to the database
      await user.save();
  
      // Return a success response
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      // If there is an error, return an error response
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;