import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true,
    },
    description: String,
    requirements: [String], 
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

export { jobSchema };