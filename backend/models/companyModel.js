import mongoose from "mongoose";

const companySchema = mongoose.Schema({
    companyName:{
      type: String,
      required: true,
    },
    website:{
      type: String,
      trim: true,
    },
    description: String,
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //
        required: true,
    },
});



export { companySchema };