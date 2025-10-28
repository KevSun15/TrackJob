import Application from "../models/applicationModel.js";
import asyncHandler from "express-async-handler";


const getMyApplications = asyncHandler(async (req, res) => {  
    const user = req.user;
    if (user.role === 'recruiter') {
            const applications = await Application.find({ recruiterId: user._id }).populate('applicantId').populate({path:'jobId', populate:'companyId'});
            res.status(200).json(applications);
    } else {
        const applications = await Application.find({ applicantId: user._id }).populate({path:'jobId', populate:'companyId'}).populate('recruiterId', 'name email');
        res.status(200).json(applications);
    }
});


const createApplication = asyncHandler(async (req, res) => {
    const {message, recruiterId, jobId} = req.body;
    const user = req.user;
    const resumeUrl = user.resume;
    const application = await Application.create({
        jobId,
        recruiterId: recruiterId,
        applicantId: user._id,
        resumeUrl,
        message,
        status: 'pending',
    });
    res.status(201).json(application);
}); 

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id, status } = req.body;
    const applicationId = id;
    const user = req.user;

    if (user.role !== 'recruiter') {
        res.status(403);
        throw new Error('Only recruiters can update application status');
    } 
    const application = await Application.findById(applicationId);
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }
    application.status = status;
    await application.save();
    res.status(200).json(application);
});



export { getMyApplications, createApplication, updateApplicationStatus };