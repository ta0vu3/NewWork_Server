const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,

    },
    first_name: {
        type:String,
        required: true

    },
    last_name: {
        type:String,
        required: true

    },
    email: {
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    type: {
        // 1 for freelancer and 2 for recruiter
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')){
        return next();
    }
    
    user.password = await bcrypt.hash(user.password,8);
    console.log("before saving and after hashing", user);
    next();
})

mongoose.model("User",userSchema);