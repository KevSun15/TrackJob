import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    
    
    const userExists = await User.findOne({email})
    
    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password
    })


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
        res.status(200).json({ message: "hello"})

});


const logoutUser = asyncHandler(async (req, res) => {
        res.status(200).json({ message: "hello"})

});

const getProfile = asyncHandler(async (req, res) => {
        res.status(200).json({ message: "hello"})

});


const updateProfile = asyncHandler(async (req, res) => {
        res.status(200).json({ message: "hello"})

});


export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile
}