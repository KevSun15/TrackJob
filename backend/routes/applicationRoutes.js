import express from 'express';
import { createApplication, getMyApplications, updateApplicationStatus} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const applicationRouter = express.Router();

applicationRouter.route('/update').put(protect, updateApplicationStatus);
applicationRouter.route('/').post(protect, createApplication);
applicationRouter.route('/my-applications').get(protect, getMyApplications);
export { applicationRouter };