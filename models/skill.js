const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
    id :{
        type:Int32Array,
        required: true

    },
    skillType :{
        type:String,
        required: true

    },
    
})