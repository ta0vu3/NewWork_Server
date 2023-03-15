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
           }
       

    }
  
})

router.post('/GETALLJOBSRecruiter', async(req,res) =>{
//need to send back jobs but also recruiter username 
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

// router.post('/GETALLJOBSRecruiter', async (req, res) => {
//     // need to send back jobs but also recruiter username
//     const { _id } = req.body;
//     if (!_id) {
//       return res.status(422).send({ error: "did not get data" });
//     } else {
//       const recruiterId = _id;
//       Recruiter.findById(recruiterId)
//         .then((recruiter) => {
//           const projectIds = recruiter.projects;
//           return Job.find({ "_id": { $in: projectIds } }).populate('Bids');})
//         .then((jobs) => {
//           if (!jobs) {
//             return res.status(404).send({ error: "No jobs found" });
//           } else {
//             const response = { recruiter, jobs };
//             return res.status(200).send(response);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           return res.status(500).send({ error: "Error retrieving data from database" });
//         });
//     }
//   });
  


module.exports = router;