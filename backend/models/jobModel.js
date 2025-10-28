import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    salary: {
        type: String,
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    workType: {
        type: String,
        enum:['on-site', 'remote', 'hybrid'],
        required: true,
    },
    
    skills: [String], 
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

const job = mongoose.model('Job', jobSchema);
export default job;
