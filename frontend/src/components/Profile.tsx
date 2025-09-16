import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextArea, Avatar, Spinner, HoverCard } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, CircleBackslashIcon } from '@radix-ui/react-icons';
import { set, useForm, type SubmitHandler } from 'react-hook-form';
import NavBar from './Navbar';
import DatePicker from "react-datepicker";
import { useUpdateUserMutation, useUpdateAvatarMutation, useUploadResumeMutation } from '../redux/usersApiSlice';
import { setCredentials } from '../redux/authSlice';
import { toast } from 'react-toastify';

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "applicant" | "recruiter";
  phoneNumber: string;
  profile: {
    bio: string;
    skills: string;
  }
  education: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date | null;
      endDate: Date | null;
    }
}

export default function Profile() {

  const { register, handleSubmit, formState: { errors }, reset, watch, resetField } = useForm<FormFields>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [startDate, setStartDate] = useState<Date | null>(userInfo?.education?.startDate ?? null);
  const [endDate, setEndDate] = useState<Date | null>(userInfo?.education?.endDate ?? null);
  const [updateUser, {isLoading}] = useUpdateUserMutation();
  const [updateAvatar, {isLoading: isUpdatingAvatar}] = useUpdateAvatarMutation();
  const [uploadResume, {isLoading: isUploadingResume}] = useUploadResumeMutation();
  
  const Navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        role: userInfo.role,
        phoneNumber: userInfo.phoneNumber || "",
        profile: userInfo.profile || {},
        education: userInfo.education || {},
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async(data:FormFields) => {
    try {
      const user = await updateUser({...data, education: {...data.education, startDate, endDate}}).unwrap();
      dispatch(setCredentials(user));
      toast.success("Profile updated successfully");
      Navigate("/");
    } catch {
      toast.error("Profile update failed");
    }
  }

  const avatarChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]){
      try{
        const url = await updateAvatar(e.target.files[0]).unwrap();
        const avatarUrl = url.avatarUrl;
        dispatch(setCredentials({...userInfo, avatarURL: avatarUrl}));
        toast.success("Avatar updated successfully");
      } catch {
        toast.error("Avatar upload failed");
      }
    }
  }


  return (
    <div className="bg-slate-100 min-h-screen">
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-22 h-22 border-4 border-gray-400 rounded-full flex items-center justify-center bg-gray-200 mb-3">
            {!isUpdatingAvatar ? (<><Avatar
            src={userInfo?.avatarURL}
		        fallback={userInfo?.firstName.charAt(0).toUpperCase() || "U"}
            radius="full"
            color="gray"
            size="6"/>
            <input type="file" accept="image/png, image/jpeg" 
              className="absolute w-20 h-20 opacity-0 cursor-pointer rounded-full"
              onChange={avatarChange}/></>) : <Spinner size="2" />}
          </div>
          {userInfo?.avatarURL && <button onClick={() => dispatch(setCredentials({...userInfo, avatarURL: undefined}))} className="mb-2 text-sm hover:underline cursor-pointer">Remove Avatar</button>}
          <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input type="text" {...register("firstName", { required: "First name is required" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="Bob"/>
                  {errors.firstName && (
                    <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input type="text" {...register("lastName", { required: "Last Name is required" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="Ross"/>
                  {errors.lastName && (
                    <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input type="email" {...register("email", {required: "Email is required",
                      validate: (value: string) => {
                        if (!value.includes("@")) {
                          return "Email must include @";
                        }
                        return true;
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="Bob.Ross@example.com"/>
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone-Number
                  </label>
                  <input type="text" {...register("phoneNumber")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder=""/>
                </div>
              </div>
              { userInfo?.role != "recruiter" && (
              <>
                <div className="space-y-4 border p-4 bg-gray-100 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                      </label>
                      <input type="text" {...register("education.institution")} 
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="University Name"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree
                      </label>
                      <input type="text" {...register("education.degree")} 
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="Bachelor's, Master's, etc."/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                      </label>
                      <input type="text" {...register("education.field")} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Computer Science, etc."/>
                    </div>
                  </div>
                  <div className="flex justify-center gap-10">
                    <label className="flex gap-3 items-center text-sm font-medium text-gray-700 mb-2">
                      Start Date
                      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="bg-white p-2 border w-40 border-gray-300 rounded-md"/>
                    </label>
                    <label className="flex gap-3 items-center text-sm font-medium text-gray-700 mb-2">
                      End Date
                      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="bg-white p-2 border w-40 border-gray-300 rounded-md"/>
                    </label>
                  </div>
                </div>     
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <input type="text" {...register("profile.skills")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="React, TypeScript, Node.js"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <div className="space-y-3">
                      <label className="cursor-pointer inline-block">
                        <span className="bg-gradient-to-br from-blue-400 to-indigo-400 px-4 py-3 rounded-lg text-center min-w-[150px] text-white font-semibold flex gap-2 items-center justify-center hover:brightness-110 transition-all">
                          {isUploadingResume ? <Spinner size="2"/> : userInfo?.resume ? "Change Resume" : "Upload Resume"} 
                          <UploadIcon className="w-4 h-4" />
                        </span>
                        <input type="file" accept=".pdf" onChange={(async(e: React.ChangeEvent<HTMLInputElement>) => {
                            try {
                              const url = await uploadResume(e.target.files?.[0]).unwrap();
                              dispatch(setCredentials({...userInfo, resume: url.resume}));
                              toast.success("Resume updated successfully");
                            } catch {
                              toast.error("Resume upload failed");
                            }
                        })} 
                          className="hidden"/>
                      </label>
                      {userInfo?.resume && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <a target="_blank" rel="noopener noreferrer" href={userInfo?.resume} className="max-w-50">Selected: <span className="hover:underline">{userInfo?.resume}</span></a>
                          <button type="button" onClick={() => {dispatch(setCredentials({...userInfo, resume: undefined})); if (fileInputRef.current) {fileInputRef.current.value = '';}}} 
                            className="p-1 border border-red-500 rounded-full hover:bg-red-50 transition-colors">
                            <Cross2Icon color='red' width="12" height="12" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <TextArea radius="large" size="3" placeholder="Tell us about yourself, your experience, and career goals..."
                  {...register("profile.bio")} className="min-h-[120px]"/>
              </div>
              <div className="flex justify-center pt-6">
                <button type="submit" className="px-8 py-3 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-lg font-semold hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}