const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const freelancerSchema = new mongoose.Schema({
    User_id :{
        type:mongoose.Schema.Types.ObjectId,
        required: true

    },
    skills: [{
        type: String
      }],
      projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }],
      rating: {
        type: Number,
        default: 0
      },
      hourlyRate: {
        type: Number,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;
