import mongoose from "mongoose";

const companySchema = mongoose.Schema({
    companyName:{
      type: String,
      required: true,
    },
    location: {
        Country: String,
        State: String,
        City: String,
    },
    website:{
      type: String,
      trim: true,
    },
    description:{
      type: String,
      trim: true,
    },
    logoUrl: String,
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});



const Company = mongoose.model('Company', companySchema);
export default Company;