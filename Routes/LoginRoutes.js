const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
//
require('dotenv').config();

router.post('/Login',(req,res) =>{
    console.log(req.body);
    const {email,password} = req.body;
    if (!email || !password){
        return res.status(422).send({error: "Please fill all fields"});
        
    }
    User.findOne({email : email})
        .then(
            async (savedUser) => {
                if (savedUser){
                    if(savedUser.password==password){
                        return res.send({message:"Login in Sucessfull"});
                        //send back profile data
                        
                    }
                    //return res.status(422).send({error:"Invalid Credentials"});
                    
                }

            }
        )
    
    User.findOne({username : email}) 
    .then(
        async (savedUser) => {
            if(savedUser){
                if(savedUser.password==password){
                    return res.send({message:"Login in Sucessfull"});
                    //send back profile data
                    
                }
                return res.status(422).send({error:"Invalid Credentials"});
                

                
            }
            

            }
            
    )   
    return res.status(422).send({error:"User does not exist"});
})

module.exports = router;