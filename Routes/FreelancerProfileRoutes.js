const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

//
require('dotenv').config();

router.get('/freelancerprofile/:id',async(req,res) =>{
    console.log("inside freelancerprofile");
    

})
module.exports = router;