const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const freelancerSchema = new mongoose.Schema({
    user :{
        //type:mongoose.Schema.Types.ObjectId,
        type:User,
        required: true

    },
    My_image: {
        type: Buffer,
        //required: true
      },
    bio: {
        type: String
      },
    skills: [{
        type: String
      }],
      projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }],
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      hourlyRate: {
        type: Number,
        default: 0
        //required: true
      },
      
    
});

 mongoose.model('Freelancer', freelancerSchema);


