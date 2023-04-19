const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer = mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const Job=mongoose.model("Job");
const Bid=mongoose.model("Bid");
const Payment=mongoose.model("Payment");
const Contract=mongoose.model("Contract");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();



router.post('/PostJob', async (req, res) => {
    console.log("inside post job");
    const { _id, user_id, skills, description, title, hourlyrate } = req.body;
    if (!_id || !skills || !description || !title || !hourlyrate) {
      return res.status(422).send({ error: "Please fill in all fields" });
    } else {
      try {
        const recruiter = await Recruiter.findById(_id);
        if (!recruiter) {
          return res.status(404).send({ error: "No recruiter found" });
        }
        const job = new Job({
          recruiter: _id,
          skills,
          description,
          title,
          hourlyrate,
        })
        await job.save();
        recruiter.projects.push(job._id);
        await recruiter.save();
        const message = "Job Posted Successfully"
        const projectIds = recruiter.projects;
        const jobs = await Job.find({ "_id": { $in: projectIds }, "status": "ongoing" }).populate('Bids');
        if (!jobs) {
          return res.status(404).send({ error: "No jobs found" });
        } else {
          return res.status(200).send({ message, recruiter, jobs });
        }
      } catch (err) {
        console.log('db error', err);
        return res.status(422).send({ error: err.message });
      }
    }
  });
  

router.post('/GETALLJOBSRecruiter', async(req,res) =>{
//need to send back ongoing jobs but also recruiter username 
const{_id}=req.body;
if(!_id ){
    return res.status(422).send({error: "did not get data"});
}
else{
    const recruiterId = _id;
    let recruiter;
   Recruiter.findById(recruiterId)
   .then(foundRecruiter => {
    recruiter = foundRecruiter; 
    const projectIds = recruiter.projects;
    return Job.find({ "_id": { $in: projectIds }}).populate('Bids');})
  .then(jobs => {
    if (!jobs) {
        return res.status(404).send({error: "No jobs found"});
      } 
    else {
    const message="Sending Recruiter Jobs";
    return res.status(200).send({message,recruiter, jobs });
     }
    //return jobs;
  })
  .catch(error => {
    console.log(error);
    return res.status(500).send({error: "Error retrieving data from database"});
   
  });          

}

})


// router.delete('/:recruiterId/DELETEJOB/:jobId', async (req, res) => {
//     console.log("deleting job");
//     const jobId = req.params.jobId;
//     const _id=req.params.recruiterId;
//     console.log(jobId)
//     console.log(_id)
//     try {
//          // Delete the job from Recruiter collection
//       const recruiter = await Recruiter.findOne({ _id: _id});
//       //console.log(recruiter);
//       if (!recruiter) {
//         return res.status(404).json({ error: 'Recruiter not found' });
//       }
//       recruiter.projects = recruiter.projects.filter(projectId => projectId.toString() !== jobId);
//       await recruiter.save();
//       // Delete the job from Job collection
//       // Delete the bids for this job
//       await Bid.deleteMany({ job: jobId });
//       const deletedJob = await Job.findByIdAndDelete(jobId);
//       if (!deletedJob) {
//         return res.status(404).json({ error: 'Job not found' });
//       }
//       console.log(deletedJob);
//       res.status(200).json({ message: 'Job deleted successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });
router.delete('/:recruiterId/DELETEJOB/:jobId', async (req, res) => {
        console.log("deleting job");
        const jobId = req.params.jobId;
        const _id=req.params.recruiterId;
        console.log(jobId)
        console.log(_id)
try {
    const deletedJob = await Job.findById(jobId);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
  
    if (deletedJob.status === 'ongoing' && deletedJob.freelancer) {
      return res.status(400).json({ error: 'Job cannot be deleted as it is ongoing and has a freelancer' });
    }
  
    const freelancer = await Freelancer.findOne({ _id: deletedJob.freelancer });
    if (freelancer) {
      freelancer.projects = freelancer.projects.filter(projectId => projectId.toString() !== jobId);
      await freelancer.save();
    }
  
    // Delete the job from Recruiter collection
    const recruiter = await Recruiter.findOne({ _id: _id });
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }
    recruiter.projects = recruiter.projects.filter(projectId => projectId.toString() !== jobId);
    await recruiter.save();
  
    // Delete the job from Job collection
    // Delete the bids for this job
    await Bid.deleteMany({ job: jobId });
    await Job.findByIdAndDelete(jobId);
  
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
  


  router.put('/:recruiterId/EDITJOB/:jobId', async (req, res) => {
    console.log("inside edit job")
    const { jobId } = req.params;
    const { title, description, hourlyrate, skills } = req.body;
    console.log( title);
    //if(!title || !description || !hourlyrate || skills.length === 0 ){
    try {
      // Find the recruiter by their recruiterId
      const recruiter = await Recruiter.findById(req.params.recruiterId);
      if (!recruiter) {
        return res.status(404).json({ error: 'Recruiter not found' });
      }
       console.log(recruiter);
      // Find the job with the given jobId from the recruiter's projects array
      const jobIndex = recruiter.projects.findIndex((projectId) => projectId.toString() === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ error: 'Job not found' });
      }
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // Update the job data with the new title, description, hourly rate, and skills
      job.title = title;
      job.description = description;
      job.hourlyrate = hourlyrate;
      job.skills = skills;
      console.log(job);
      // Save the updated job to the database
      await job.save();
  
      // Send a success response
      res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Server error' });
    }
// }else{
//     console.log("please input all fields")
//     res.status(500).json({ error: 'Input all fields please' });
// }
  });

 //GETALLpaymentsRecruiter

router.post('/GETALLpaymentsRecruiter', async(req,res) =>{
    try {
        const { username } = req.body;
      if(username==""){
          return res.status(422).send({error: "did not get data"});
      }
        const payments = await Payment.find({
          recruiter: username
        }).populate('job', 'title');
        res.status(200).json({ message: 'Sending Recruiter Payments',payments });
        //res.json(payments);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }

});

//GetActivejobsRecruiter'
router.post('/GetActiveJOBSsRecruiter', async (req, res) => {
    try {
      const { _id } = req.body;
    if(_id==""){
        return res.status(422).send({error: "did not get data"});
    }
    //also add check if freelancer exists
      const jobs = await Job.find({
        recruiter: _id,
        status: 'ongoing',
        freelancer: { $exists: true },
        
      });
      res.status(200).json({ message: 'Active jobs Found',jobs });
      //res.json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  router.post('/PostPayment', async(req,res) =>{
    try {
        // get job ID and payment details from request body
        const { job_id, amount, cardNumber, expiryDate, cvv, paymentMethod } = req.body;
        console.log("inside payment");
        console.log(job_id);
        // get job object and corresponding recruiter/freelancer IDs
        const job = await Job.findById(job_id);
        const recruiter_id = job.recruiter;
        const freelancer_id = job.freelancer;

        // get recruiter and freelancer usernames from User schema
        const recruiter = await Recruiter.findById(recruiter_id);
        const freelancer = await Freelancer.findById(freelancer_id);
        console.log(recruiter);
        const userF = await User.findById(freelancer.user_id);
        const usernameF=userF.username;
        const userR = await User.findById(recruiter.user_id);
        const usernameR = userR.username;

        // create new payment object
        const newPayment = new Payment({
            job: job_id,
            usernameF: usernameF,
            usernameR: usernameR,
            amount: amount,
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv,
            paymentMethod: paymentMethod,
            status: 'pending' // set initial status to pending
        });

        // save new payment to database
        await newPayment.save();

        // add payment ID to corresponding job's payments array
        job.payment.push(newPayment._id);
        await job.save();

        // send success response
        res.status(200).json({
            success: true,
            message: 'Payment created successfully',
            payment: newPayment
        });
    } catch (err) {
        // handle error and send error response
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: err.message
        });
    }
});



router.get('/GETALLJOBS', async (req, res) => {
    try {
      // find all jobs with these conditions
      const jobs = await Job.find({
        status: 'ongoing',
        freelancer: { $eq: null }
      });
  
      // get usernames of recruiters associated with jobs
      const usernames = [];
  
      for (const job of jobs) {
        const recruiter = await Recruiter.findById(job.recruiter);
        const user = await User.findById(recruiter.user_id);
        usernames.push(user.username);
      }
  
      console.log(jobs);
      console.log(usernames);
  
      res.json({message:'Sending Jobs', jobs, usernames}); // return jobs and usernames as JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching jobs' });
    }
  });
  
  

  
  router.post('/acceptBid', async (req, res) => {
    try {
      console.log("inside accept bid");
      const { bidId, jobId } = req.body;
      console.log(bidId);
      console.log(jobId);
      // Find the bid
      const bid = await Bid.findById(bidId);
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
    
      // Check if the job already has a freelancer
      const job = await Job.findById(jobId);
      if (job.freelancer) {
        return res.status(400).json({ message: 'Job already has a freelancer' });
      }
  
      // Create the contract
      const contract = new Contract({
        job: jobId,
        freelancer: bid.freelancer,
        amount: bid.amount
      });
      await contract.save();
    
      // Update the job to mark it as closed and set the freelancer
      const updatedJob = await Job.findByIdAndUpdate(
        jobId, 
        { $set: { freelancer: bid.freelancer, contract: contract._id } },
        { new: true }
      );
      if (!updatedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }
      const updatedFreelancer = await Freelancer.findOneAndUpdate(
        { _id: bid.freelancer },
        { $push: { projects: jobId } },
        { new: true }
      );
      // Return the updated job
      console.log(updatedJob);
      res.json({ message: "Bid accepted successfully", job: updatedJob, contract, bid });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  })
  

  

module.exports = router;