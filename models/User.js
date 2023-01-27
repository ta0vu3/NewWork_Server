const mongoose = require('mongoose');
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
    }
})

mongoose.model("User",userSchema);