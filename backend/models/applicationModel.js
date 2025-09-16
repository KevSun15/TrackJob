import mongoose from "mongoose";

const applicationModel = new mongoose.Schema({
  applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', 
        required: true,
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewed', 'interviewing', 'hired', 'rejected'],
        default: 'submitted',
    },
    resumeUrl: String,
    appliedAt: {
        type: Date,
        default: Date.now,
    },

});


export { applicationModel }