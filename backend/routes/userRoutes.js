import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateProfile } from '../controllers/userControllers.js'
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.route("/profile").get(getProfile).put(updateProfile)


export {userRouter}