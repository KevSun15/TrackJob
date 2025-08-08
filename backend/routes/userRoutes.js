import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateProfile } from '../controllers/userControllers.js'
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.route("/profile").get(protect, getProfile).put(protect, upload.single('resume'), updateProfile);


export {userRouter}