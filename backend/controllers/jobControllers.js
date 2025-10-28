import asyncHandler from 'express-async-handler';
import Job from '../models/jobModel.js';
import Company from '../models/companyModel.js';


const parseJSON = (data) => {
        if (!data) return {};
        return typeof data === 'string' ? JSON.parse(data) : data;
    };

const postJob = asyncHandler(async (req, res) => {
    const { title, description, salary, jobType, workType, company, skills} = req.body;
    const user = req.user;
    if (user.role !== 'recruiter') {
        res.status(403);
        throw new Error('Only recruiters can post jobs');
    }
    const foundCompany = await Company.findOne({ _id: company, recruiterId: user._id });
    if (!foundCompany) {
        res.status(400);
        throw new Error('Company not found or you are not authorized to post jobs for this company');
    }
    const newJob = await Job.create({title, description, salary, jobType, workType, skills: skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [], companyId: foundCompany._id, recruiterId: user._id,
    });
    if (newJob) {
        res.status(201).json(newJob);
    } else {
        res.status(400);
        throw new Error('Invalid Job Data');
    }
});

const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find().populate('companyId').populate('recruiterId', 'firstName lastName email');
    res.status(200).json(jobs);
});

const getMyJobs = asyncHandler(async (req, res) => {
    const user = req.user;
    const jobs = await Job.find({ recruiterId: req.user._id }).populate('companyId').populate('recruiterId', 'firstName lastName email');
    res.status(200).json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('companyId', 'companyName').populate('recruiterId', 'firstName lastName email');
    if (job) {
        res.status(200).json(job);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

const updateJob = asyncHandler(async (req, res) => {
    const { title, description, salary, location, jobType, workType, company, skills} = req.body;
    const user = req.user;

    const job = await Job.findById(req.params.id);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (user.role !== 'recruiter' || job.recruiterId.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this job  posting');
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (salary) job.salary = salary;
    if (location) job.location = parseJSON(location);
    if (jobType) job.jobType = jobType;
    if (workType) job.workType = workType;
    if (company) job.companyId = company;
    if (skills) job.skills = parseJSON(skills);

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
    const user = req.user;

    const job = await Job.findById(req.params.id);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (user.role !== 'recruiter' || job.recruiterId.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this job posting');
    }

    await job.remove();
    res.status(200).json({ message: 'Job removed' });
});

const getCompanyJobs = asyncHandler(async (req, res) => {
    const companyId = req.params.companyId;
    const jobs = await Job.find({ companyId }).populate('companyId', 'companyName location website description' ).populate('recruiterId', 'firstName lastName email');
    res.status(200).json(jobs);
});

export { postJob, getAllJobs, getMyJobs, getJobById, updateJob, deleteJob, getCompanyJobs };



