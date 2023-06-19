const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const crypto = require('crypto');

const freelancerSchema = new mongoose.Schema({
    user_id :{
        type: mongoose.Schema.Types.ObjectId,
        //type:User,
        required: true

    },
    My_image: {
        type: String,
        //required: true
        default:"https://www.google.com/search?q=recruiter+avatar&rlz=1C5CHFA_enUS976US980&sxsrf=AJOqlzVAVZtZqxGPDBE_Il7ud5cXMiKiWA:1676625723452&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjMq6vFnZz9AhVpk4kEHdxyBuYQ_AUoAXoECAIQAw&biw=1112&bih=739&dpr=2#imgrc=riHOB7r3SE-TnM&imgdii=QlZv5SIL-Kb2HM"
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
      //addcarddetails in here
      cardDetails: {
        cardNumber: {
            type: String,
            //required: true,
            set: (plaintext) => encrypt(plaintext, process.env.jwt_secret)
        },
        expirationDate: {
            type: String,
            //required: true,
            set: (plaintext) => encrypt(plaintext, process.env.jwt_secret)
        },
        cvv: {
            type: String,
           // required: true,
            set: (plaintext) => encrypt(plaintext, process.env.jwt_secret)
        }
    }
    
});
// Function to encrypt card information
function encrypt(plaintext, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
// Function to decrypt payment information
function decrypt(encrypted, password) {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
 mongoose.model('Freelancer', freelancerSchema);


