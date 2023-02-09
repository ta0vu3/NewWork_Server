const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    User_id :{
        type:mongoose.Schema.Types.ObjectId,
        required: true

    },
    My_image: {
        type: Buffer,
        //required: true
      },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
      }],
      company: {
        type: String,
        
      },
});

 mongoose.model('Recruiter', RecruiterSchema);
