const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const freelancerSchema = new mongoose.Schema({
    User_id :{
        type:mongoose.Schema.Types.ObjectId,
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


