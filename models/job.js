  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

require('dotenv').config();
const ContractSchema = new Schema({
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'Freelancer',
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    disputeResolution: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });




  const PaymentSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      },
    amount: {
      type: Number,
      required: true
    },
    cardNumber: {
        type: String,
        required: true
      },
      expiryDate: {
        type: String,
        required: true
      },
      cvv: {
        type: String,
        required: true
      },
    status: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Credit Card', 'PayPal']
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
  });
  
  const BidSchema = new Schema({
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'Freelancer',
      required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      },
    amount: {
      type: Number,
      required: true
    },
    message: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const JobSchema = new Schema({
    status: {
        type: String,
        required: true,
        default:"ongoing"
        //ongoing or completed
      },
    title: {
      type: String,
      required: true
    },
    Bids:[{
        //type: Schema.Types.ObjectId,
        type: BidSchema,
        ref: 'Bid',
    }],
    description: {
      type: String,
      required: true
    },
    hourlyrate: {
      type: Number,
      required: true
    },
    payment:[{ 
        //type: Schema.Types.ObjectId,
        type: PaymentSchema,
        ref: 'payment',
    }],
    contract:{
        //type: Schema.Types.ObjectId,
        type: ContractSchema,
        ref: 'Contract',
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'Freelancer'
    },
    skills: [{
        type: String,
        required: true
      }],
    rating:{
        //this is the rating the recruiter will give to freelancer after job done
        type: Number,
        min: 0,
        max: 5,
    } , 
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Function to encrypt payment information
function encrypt(text, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(text, 'utf8', 'hex');
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
  

PaymentSchema.pre('save', async function(next) {
    const payment = this;
    const fieldsToEncrypt = ['cardNumber', 'expiryDate', 'cvv'];

    for (let i = 0; i < fieldsToEncrypt.length; i++) {
        const field = fieldsToEncrypt[i];
        if (!payment.isModified(field)) continue;
        payment[field] = await encrypt(payment[field], process.env.jwt_secret);
    }

    next();
});

const Payment = mongoose.model('Payment', PaymentSchema);
const Job = mongoose.model('Job', JobSchema);
const Bid = mongoose.model('Bid', BidSchema);
const Contract = mongoose.model('Contract', ContractSchema);

module.exports = {
    Payment,
    Job,
    Bid,
    Contract,
};

//to export const { Payment, Job, Bid } = require('./models');
  // Example usage
// const paymentInformation = '4111 1111 1111 1111';
// const password = 'secret';
// const encryptedPaymentInformation = encrypt(paymentInformation, password);
// const decryptedPaymentInformation = decrypt(encryptedPaymentInformation, password);

   
  
  

  
  
  
  