const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const Job=mongoose.model("Job")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();


router.post('/PostJob', async(req,res) =>{
   console.log("inside post job");
   const{_id,user_id,skills,description,title,hourlyrate}=req.body;
    if(!_id ){
        return res.status(422).send({error: "did not get complete data"});
    }
    else if(!skills || !description || !title || !hourlyrate){
        return res.status(422).send({error: "Kindly fill all fields"});
    }
    else{
     var recruiter=_id;
        const job= new Job({
            recruiter,
            skills,
            description,
            title,
            hourlyrate,
        })
        try{
           //await user.save();
           await job.save();
           //const token = jwt.sign({_id: user._id},process.env.jwt_secret);
           const recruiter= await Recruiter.findByIdAndUpdate(
            {'_id':_id},
            {$push:{'projects':job._id}},
            { new: true } 
           );
           const message ="Job Posted Sucessfully"
           res.send({message,job,recruiter});
           //open profile

       }
        catch (err) {
              console.log('db error',err);
              return res.status(422).send({error : err.message});
           }////
       

    }
  
})

module.exports = router;