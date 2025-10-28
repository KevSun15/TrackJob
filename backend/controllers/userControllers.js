import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { getDataUri } from '../utils/dataUri.js';
import { cloudinary } from '../config/cloudinary.js';


const parseJSON = (data) => {
        if (!data) return {};
        return typeof data === 'string' ? JSON.parse(data) : data;
};

const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password, role} = req.body;
    
    
    const userExists = await User.findOne({email})
    
    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const newUser = await User.create({firstName, lastName, email, password, role})

    if (newUser) {
        generateToken(res, newUser._id, newUser.email);
        const { password, ...userWithoutPassword}= newUser.toObject()
        res.status(201).json(userWithoutPassword);

    }
    else {
        res.status(400);
        throw new Error('Invalid User Data');
    }
});


const loginUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        
        if (user && (await user.validatePass(password))){
            generateToken(res, user._id, user.email);
            const { password, ...userWithoutPassword}= user.toObject()
            res.status(201).json(userWithoutPassword);
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }

});


const logoutUser = asyncHandler(async (req, res) => {
    
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    
    res.status(200).json({ message: "Logged Out User"});

});

const getProfile = asyncHandler(async (req, res) => {

    const {...user} = req.user.toObject();
    res.status(200).json(user);

});


const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, profile, education } = req.body;
    const user = req.user;

    const updateData = {};
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profile) {
        const profileData = parseJSON(profile);
        if (profileData.bio) user.profile.bio = profileData.bio;
        if (profileData.socialURL) {
            user.profile.socialURL = {
                ...user.profile.socialURL,
                ...profileData.socialURL
            };
        }
      }
    if (education) user.education = parseJSON(education);
    const updatedUser = await job.save();
    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userResponse } = updatedUser.toObject();
    res.status(200).json(userResponse);
});



const uploadResume = asyncHandler(async(req,res) => {
  const user = req.user;
  let cloud;
  if (req.file){
    const fileUri = getDataUri(req.file);
    cloud = await cloudinary.uploader.upload(fileUri.content, {
            public_id: `resume_${user._id}`,
            folder: "resumes",
            resource_type: 'auto'
        });
        const updatedFields = {
        "resume": cloud.secure_url
      };
    const newUser = await User.findByIdAndUpdate(user._id, updatedFields, { new: true });
      console.log(newUser.resume)
    if (newUser){
      res.status(200).json({ resume: newUser.resume });
    }
  }
    
});


const updateAvatar = asyncHandler(async(req,res) => {
  const user = req.user;
  let cloud;
  if (req.file){
    const fileUri = getDataUri(req.file);
    cloud = await cloudinary.uploader.upload(fileUri.content, {
            public_id: `avatar_${user._id}`,
            folder: "avatars",
            resource_type: 'auto'
        });
        const updatedFields = {
        "avatarUrl": cloud.secure_url
      };
    const newUser = await User.findByIdAndUpdate(user._id, updatedFields, { new: true });

    if (newUser){
      res.status(200).json({ avatarUrl: newUser.avatarUrl });
    }
  }
    
});

const deleteAvatar = asyncHandler(async(req,res) => {
  const user = req.user;

  const cloud = await cloudinary.uploader.destroy(`avatars/avatar_${user._id}`);    
  const updatedFields = {
    "avatarUrl": null
  };
  const newUser = await User.findByIdAndUpdate(user._id, updatedFields, { new: true });
  if (newUser){
    res.status(200).json({ avatarUrl: newUser.avatarUrl });
  }
    
});

const getCompanies = asyncHandler(async (req, res) => {
    const user = req.user;
    await user.populate('company');
    res.status(200).json(user.company);
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    uploadResume,
    updateAvatar,
    deleteAvatar,
}


