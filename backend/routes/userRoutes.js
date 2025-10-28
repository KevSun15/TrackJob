import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateProfile, uploadResume, updateAvatar, deleteAvatar } from '../controllers/userControllers.js'
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.route("/profile").get(protect, getProfile).put(protect, updateProfile);
userRouter.route("/profile/resume").post(protect, upload.single('resume'), uploadResume);
userRouter.route("/profile/avatar").put(protect, upload.single('avatar'), updateAvatar).delete(protect, deleteAvatar);

export {userRouter}