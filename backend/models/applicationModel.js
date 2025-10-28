import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
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
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
    },
    status: {
        type: String,
        enum: ['Pending', 'Hired', 'Rejected'],
        default: 'Pending',
    },
    resumeUrl: String,
    message: String, 
    appliedAt: {
        type: Date,
        default: Date.now,
    },

});


const Application = mongoose.model('Application', applicationSchema);
export default Application;
