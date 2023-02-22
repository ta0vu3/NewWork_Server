const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Freelancer =mongoose.model("Freelancer");
const Recruiter =mongoose.model("Recruiter");
const jwt = require("jsonwebtoken");

//
require('dotenv').config();

router.post('/freelancerprofile',async(req,res) =>{
    //bio
    //skills
    //projects
    //rating
         console.log("inside profile route");
    
        const {user_id} = req.body;
        
        
        // const { authorization } = req.headers;
        // //    authorization = "Bearer afasgsdgsdgdafas"
        // if (!authorization) {
        //     return res.status(401).json({ error: "You must be logged in, token not given" });
        // }
        // const token = authorization.replace("Bearer ", "");
        // // console.log(token);
    
        // jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        //     if (err) {
        //         return res.status(401).json({ error: "You must be logged in, token invalid" });
        //     }
            //const { _id } = payload;
           
            const freelancer = await Freelancer.findOne({ 'user_id': user_id })
            const user=await User.findOne({'_id':user_id});
            //.populate('user');
               
               if(freelancer){
                console.log(freelancer);   
                //const { user_id,_id, Projects,skills,rating,hourlyrate} = freelancer;
                res.status(200).send({
                    message: "Got Profile data",
                    freelancer,
                    user,
                });
            
            }
            else{
                return res.status(422).json({ error: "Freelancer does not exist"});
            }
            
              
            
            
    
        //})
    

    

})

router.post('/AddSkillsfreelancer',async(req,res) =>{
    const{_id,skills}=req.body;
    console.log(req.body);
    
    if(!skills)
    {
        return res.status(422).send({error: "Cannot continue without selecting some skills"});
    }
    const newData = {skills};
   
    const freelancer= await Freelancer.findOneAndUpdate(
        {'user_id':_id},
        newData,
        { new: true } 
    );
    console.log(freelancer);
    if(freelancer){
        res.status(200).send({
            message: "freelancer skills updated",
             freelancer,
        });

    }
    else{
        return res.status(422).json({ error: "problem with update"});
    }
})
router.post('/freelancerupdate',async(req,res) =>{
    
    const{_id,user_id,skills,bio,My_image,hourlyRate,first_name,last_name,username}=req.body;
    if (!first_name || !last_name){
        console.log(first_name+last_name);
        return res.status(422).send({error: "Please fill the name field"});
    }
  
    const newData={
        skills,
        bio,
        //My_image,
        hourlyRate,
        //rating,
    }
    
    const userdata={
        //email,
        first_name,
        last_name,
        //username,

    }
    
    const updateduser= await User.findByIdAndUpdate(
        {'_id':user_id},
        userdata,
        { new: true } 
    );
    console.log(updateduser);
    //res.json({ message: "user updated",  user: { updateduser }});
            
    const updatedFreelancer=await Freelancer.findByIdAndUpdate(
        { '_id': _id }, // filter to find the document to update
        newData, // new data to set in the update
        { new: true } // option to return the updated document
      );
      console.log(updatedFreelancer);  
    if(updatedFreelancer && updateduser){   
            res.status(200).send({
                message: "freelancer updated",
                freelancer: {updatedFreelancer},
                user:{updateduser}
            });
            
        
    }
    else{
        return res.status(422).json({ error: "problem with update"});
    }
       
       
   

})

router.post('/Addhourlyrateandbio',async(req,res) =>{
    const{_id,bio,hourlyRate}=req.body;
    if(!hourlyRate || !bio){
        return res.status(422).send({error: "Please fill both fields"});
    }
    const newData={
       
        bio,
        //My_image,
        hourlyRate,
        //rating,
    }

    const freelancer= await Freelancer.findByIdAndUpdate(
        {'_id':_id},
        newData,
        { new: true } 
    );
   if(freelancer){
    res.status(200).send({
        message: "freelancer updated",
        freelancer,
    });

   }else{
    return res.status(422).json({ error: "problem with update"});
   }
   

})

router.post('/GetrecruiterProfileData',async(req,res)=>{
    const{_id,user_id}=req.body;
    if(!_id || !user_id){
        return res.status(422).send({error: "did not get data"});
    }
    const newData={
       _id,
       user_id,
    }
    const recruiter= await Recruiter.findById(
        {'_id':_id});
    const user=await User.findById({'_id':user_id});
   if(recruiter){
    res.status(200).send({
        message: "Sending Profile data",
        recruiter,
        user,
    });

   }else{
    return res.status(422).json({ error: "Could not find recruiter"});
   }

})
router.post('/AddBioandcompany',async(req,res) =>{
    const{_id,bio,company}=req.body;
    if(!company || !bio){
        return res.status(422).send({error: "Please fill both fields"});
    }
    const newData={
       
        bio,
        //My_image,
        company,
        //rating,
    }

    const recruiter= await Recruiter.findByIdAndUpdate(
        {'_id':_id},
        newData,
        { new: true } 
    );
   if(recruiter){
    res.status(200).send({
        message: "recruiter updated",
        recruiter,
    });

   }else{
    return res.status(422).json({ error: "problem with update"});
   }
   

})
module.exports = router;