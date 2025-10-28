import express from 'express';
import { postJob, getAllJobs, getMyJobs, getJobById, updateJob, deleteJob, getCompanyJobs} from '../controllers/jobControllers.js';
import { protect } from '../middleware/auth.js';

const jobRouter = express.Router();

jobRouter.route('/my-jobs').post(protect, postJob).get(protect, getMyJobs);
jobRouter.route('/').get(getAllJobs);
jobRouter.route('/:id').get(getJobById).put(protect, updateJob).delete(protect, deleteJob);
jobRouter.route('/company-jobs/:companyId').get(getCompanyJobs);

export { jobRouter };



