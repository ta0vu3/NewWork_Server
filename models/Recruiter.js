const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Job = require('./job');

const RecruiterSchema = new Schema({
    user :{
        //type:mongoose.Schema.Types.ObjectId,
        type : User,
        required: true

    },
    bio :{
        type: String,
    },
    My_image: {
        type: Buffer,
        //required: true
      },
    projects: [{
        type: Schema.Types.ObjectId,
        //type : Job,
        ref: 'Job'
      }],
      company: {
        type: String,
        
      },
});

 mongoose.model('Recruiter', RecruiterSchema);
