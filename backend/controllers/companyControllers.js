import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { getDataUri } from '../utils/dataUri.js';
import { cloudinary } from '../config/cloudinary.js';

const createCompany = asyncHandler(async (req, res) => {
    const { companyName, location, website, description } = req.body;
    const user = req.user;

    if (user.role !== 'recruiter') {
        res.status(403);
        throw new Error('Only recruiters can create companies');
    }

    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
        res.status(400);
        throw new Error('Company with this name already exists');
    }
    const newCompany = await Company.create({ companyName, location, website, description, recruiterId: user._id });
    console.log(newCompany);
    res.status(201).json(newCompany);
});

const getCompaniesByRecruiterId = asyncHandler(async (req, res) => {
    const recruiterId = req.params.id;
    const recruiterCompanies = await Company.find({ recruiterId: recruiterId });
    if (!recruiterCompanies) {
        res.status(404);
        throw new Error('Recruiter not found');
    }

    res.status(200).json(recruiterCompanies);
});

const updateCompany = asyncHandler(async (req, res) => {
    const {companyName, location, website, description } = req.body;
    const user = req.user;
    const companyId = req.params.id;

    if (user.role !== 'recruiter') {
        res.status(403);
        throw new Error('Only recruiters can update companies');
    }

    const company = await Company.findById(companyId);


    if (!company) {
        res.status(404);
        throw new Error('Company not found');
    }

    if (company.recruiterId.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('You are not authorized to update this company');
    }

    company.companyName = companyName || company.companyName;
    company.location = location || company.location;
    company.website = website || company.website;
    company.description = description || company.description;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
});

const uploadCompanyLogo = asyncHandler(async (req, res) => {
  const user = req.user;
  let cloud;
  if (req.file){
    const fileUri = getDataUri(req.file);
    cloud = await cloudinary.uploader.upload(fileUri.content, {
            public_id: `logo_${user._id}`,
            folder: "company_logos",
            resource_type: 'auto'
        });
        const updatedFields = {
        "logoUrl": cloud.secure_url
      };
    const newCompany = await Company.findOneAndUpdate(
      { recruiterId: user._id },  
      updatedFields,
      { new: true }
    );
    if (newCompany){
      res.status(200).json({ logoUrl: newCompany.logoUrl });
    }
  }
});

const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find();
    res.status(200).json(companies);
});

export { createCompany, uploadCompanyLogo, getAllCompanies, getCompaniesByRecruiterId };