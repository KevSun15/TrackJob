import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { getDataUri } from '../utils/dataUri.js';
import { cloudinary } from '../config/cloudinary.js';







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
    const { firstName, lastName, email, phoneNumber, profile, education} = req.body;
    const user = req.user;
    const newProfile = {};

    if (firstName) newProfile.firstName = firstName;
    if (lastName) newProfile.lastName = lastName;
    if (email) newProfile.email = email;
    if (phoneNumber) newProfile.phoneNumber = phoneNumber;
    let profileData = {};
    if (profile) {
        profileData = typeof profile === 'string' ? JSON.parse(profile) : profile;
            console.log("hello3")
        if (profileData.bio){
            newProfile['profile.bio'] = profileData.bio;
        };
        if (profileData.skills){
        newProfile['profile.skills'] = profileData.skills;
        };
    };
    let educationData = {};
    if (education) {
        educationData = typeof education === 'string' ? JSON.parse(education) : education;
        newProfile['education.institution'] = educationData.institution;
        newProfile['education.degree'] = educationData.degree;
        newProfile['education.field'] = educationData.field;
        newProfile['education.startDate'] = educationData.startDate;
        newProfile['education.endDate'] = educationData.endDate;
    };
    

    console.log(newProfile)
    const updatedUser = await User.findByIdAndUpdate(user._id, newProfile, { new: true });

    if (updatedUser){
        const { password, ...userWithoutPassword} = updatedUser.toObject();
        console.log(userWithoutPassword);
        res.status(200).json(userWithoutPassword);
    } else {
        res.status(500)
        throw new Error('Something went wrong');
    };


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


export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    uploadResume,
    updateAvatar
}


