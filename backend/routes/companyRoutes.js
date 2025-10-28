import express from 'express';
import { createCompany, getAllCompanies, uploadCompanyLogo, getCompaniesByRecruiterId } from '../controllers/companyControllers.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const companyRouter = express.Router();

companyRouter.route('/').post(protect, createCompany).get(getAllCompanies);
companyRouter.route('/recruiter/:id').get(protect, getCompaniesByRecruiterId);
companyRouter.route('/logo').put(protect, upload.single('logo'), uploadCompanyLogo);


export { companyRouter };
