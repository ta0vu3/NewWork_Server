const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const Job=mongoose.model("Job");
const Bid=mongoose.model("Bid");
const Payment=mongoose.model("Payment");
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
        const updatedjob = await Job.findByIdAndUpdate(
            job,
            { $push: { Bids: bid._id } },
            { new: true }
        );
        console.log(bid)
        res.send({
            message:"Posted Bid sucessfully",
            updatedjob,
        });

        } catch (err) {
            console.log('db error',err);
            return res.status(422).send({error : err.message});
         }
    }

})

// router.get('/GetMyJobs/:_id', async(req,res) =>{
//     try{
//         console.log("getting freelancers jobs")
//         const freelancer = await Freelancer.findById(req.params._id);
//         if (!freelancer) {
//             return res.status(404).json({ error: 'freelancer not found' });
//           }
//           //add here to get all jobs that have freelancer=freelancerId
//           const jobs = await Job.find({ freelancer: { $eq: null } }).populate('recruiter');
//           console.log(jobs);
//           res.json({message:"Sending back freelancers Jobs",jobs});
//     }catch (error) {
//         console.error('Error getting jobs:', error);
//         res.status(500).json({ error: 'Server error' });
//       }
// })
router.get('/GetMyJobs/:_id', async(req,res) =>{
    try{
        console.log("getting freelancers jobs")
        const freelancer = await Freelancer.findById(req.params._id).populate('projects');
        if (!freelancer) {
            return res.status(404).json({ error: 'freelancer not found' });
        }
        const jobs = await Job.find({ freelancer: req.params._id }).populate('recruiter');
        console.log(jobs);
        res.json({message:"Sending back freelancers Jobs",jobs});
    }catch (error) {
        console.error('Error getting jobs:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/GetJobs', async(req,res) =>{
    try{
        const jobs = await Job.find({ freelancer: req.params.freelancerId }).populate('recruiter');
          console.log(jobs);
          res.json({message:"Sending back All available Jobs",jobs});
    }catch (error) {
        console.error('Error getting jobs:', error);
        res.status(500).json({ error: 'Server error' });
      }
})

router.put('/:job_id/Finishjob',async(req,res)=>{
    //finds job from Job schema using job_id and updates status to competed
    try {
        const jobId = req.params.job_id;
        const updatedJob = await Job.findByIdAndUpdate(
          jobId,
          { status: 'completed' },
          { new: true } // Return the updated document
        );
    
        if (!updatedJob) {
          return res.status(404).json({ error: 'Job not found' });
        }
    
        res.json(updatedJob);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
})
router.get('/:username/GetfreelancersPayments',async(req,res)=>{
    //this functions finds freelancer using username and then loops through projects in Freelancer schema which are list of _ids of jobs from Job schema
    //after getting the job id's it goes to payment schema and find all payments with these job ids
    console.log("inside freelancer payments");
    try {
        const payments = await Payment.find({ usernameF: req.params.username }).populate('job');
        console.log(payments);
        console.log(req.params.username);
        res.status(200).json({message:"Sending Freelancers Payments",payments});
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
})

module.exports = router;