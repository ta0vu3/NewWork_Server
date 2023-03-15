const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const Job=mongoose.model("Job");
const Bid=mongoose.model("Bid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();


router.post('/PostBid', async(req,res) =>{
    //get jobid,freelancerid,rate,message
    const{freelancer,job,message,amount}=req.body;
    if(!freelancer || !job || !message || amount==0){
        return res.status(422).send({error: "did not get data"});
    }else{
        const bid = new Bid({
           job,
           message,
           freelancer,
           amount,
        })
        try{
        await bid.save();
        const Updatejob= await Job.findByIdAndUpdate(
            {$push:{'Bids':bid._id}},
            { new: true } 
           );
        res.send({
            message:"Posted Bid sucessfully",
            Updatejob,
        });

        } catch (err) {
            console.log('db error',err);
            return res.status(422).send({error : err.message});
         }
    }

})

module.exports = router;