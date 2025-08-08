import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { getDataUri } from '../utils/dataUri.js';
import { cloudinary } from '../config/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    
    
    const userExists = await User.findOne({email})
    
    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const newUser = await User.create({firstName, lastName, email, password})


    if (newUser) {
        generateToken(res, newUser._id, newUser.email);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        })
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
            res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
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

    res.status(200).json({ 
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
    })

});


const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, location, role, profile} = req.body;
    const user = req.user;

    const newProfile = {};

    if (firstName) newProfile.firstName = firstName;
    if (lastName) newProfile.lastName = lastName;
    if (email) newProfile.email = email;
    if (phoneNumber) newProfile.phoneNumber = phoneNumber;
    if (location) newProfile.location = location;
    if (role) newProfile.role = role;

    let profileData = {};
    if (profile) {
        profileData = typeof profile === 'string' ? JSON.parse(profile) : profile;
        if (profileData.bio){
            newProfile['profile.bio'] = profileData.bio;
        };
        if (profileData.skills){
        newProfile['profile.skills'] = profileData.skills;
        };
        for (const [key, value] of Object.entries(profileData.education)) {
        newProfile[`profile.education.${key}`] = value;
        }
    };

    if (req.file){
        const fileUri = getDataUri(req.file);
        const cloud = await cloudinary.uploader.upload(fileUri.content, {
            public_id: `resume_${user._id}_${Date.now()}`,
            folder: "resumes",
            resource_type: 'auto'
        });
        newProfile['profile.resumeData.resumeUrl'] = cloud.secure_url;
        newProfile['profile.resumeData.publicId'] = cloud.public_id;
        newProfile['profile.resumeData.originalName'] = req.file.originalname;
    };

    const updatedUser = await User.findByIdAndUpdate(user._id, newProfile, { new: true });

    if (updatedUser){
        res.status(200).json({ 
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber
        });
    } else {
        res.status(500)
        throw new Error('Something went wrong');
    };


});


export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile
}