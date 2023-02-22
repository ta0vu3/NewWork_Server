const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Job = require('./job');

const RecruiterSchema = new Schema({
    user_id :{
        //type:mongoose.Schema.Types.ObjectId,
        //type : User,
        type: mongoose.Schema.Types.ObjectId,
        required: true

    },
    bio :{
        type: String,
    },
    My_image: {
        type: String,
        default:"https://www.google.com/search?q=recruiter+avatar&rlz=1C5CHFA_enUS976US980&sxsrf=AJOqlzVAVZtZqxGPDBE_Il7ud5cXMiKiWA:1676625723452&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjMq6vFnZz9AhVpk4kEHdxyBuYQ_AUoAXoECAIQAw&biw=1112&bih=739&dpr=2#imgrc=RiDpXqx1eJR6nM&imgdii=Nq2amP2xRvgWfM"
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
