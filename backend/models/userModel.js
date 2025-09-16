import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim:true,
        required: true
    },
    lastName:{
        type: String,
        trim:true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        select:false
    },
    phoneNumber:{
        type: String,
    },
    role:{
        type: String,
        enum: ["applicant", "recruiter"],
        required: true
    },
    profile:{
        bio:{
            type: String,
            trim: true,
            maxLength: 1000
        },
        skills:{
            type: String
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
    },
    resume: String,
    education:{
            institution:{
                type: String,
                required: true,
                trim: true
            },
            degree:{
                type: String,
                required: true,
                trim: true,
            },
            field:{
                type: String,
                trim: true
            },
            startDate:{
                type: Date
            },
            endDate:{
                type: Date
            }
        },
      avatarUrl: String,

}, {
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.validatePass = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;