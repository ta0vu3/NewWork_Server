const ContractSchema = new Schema({
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'Freelancer',
      required: true
    },
    terms: {
      type: String,
      required: true
    },
    paymentTerms: {
      type: String,
      required: true
    },
    disputeResolution: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

const Contract = mongoose.model('Contract', ContractSchema);
module.exports = Contract;
  