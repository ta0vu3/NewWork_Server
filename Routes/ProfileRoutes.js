const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer =mongoose.model("Freelancer");
const jwt = require("jsonwebtoken");

//
require('dotenv').config();

router.post('/freelancerprofile',async(req,res) =>{
    console.log("inside freelancerprofile");
    const {email,password} = req.body;
    const User_id = await User.findById({ email : email});
    const savedUser = await User.findOne({ email : email});
    const freelancer = await Freelancer.findOne({User_id: User_id});

    

})
module.exports = router;