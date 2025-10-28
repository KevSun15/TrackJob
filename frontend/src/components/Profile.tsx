import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Spinner } from '@radix-ui/themes';
import { GraduationCap, User, Phone, ArrowRight } from 'lucide-react';
import { UploadIcon, GitHubLogoIcon, Link1Icon, LinkedInLogoIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import NavBar from './Navbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateUserMutation, useUpdateAvatarMutation, useDeleteAvatarMutation } from '../redux/apiSlices/usersApiSlice';
import { setCredentials, setAvatar } from '../redux/authSlice';
import { toast } from 'sonner';

type FormFields = {
  firstName: string; lastName: string; email: string; phoneNumber: string;
  profile: { bio: string; socialURL: { linkedin: string; github: string; website: string; }};
  education: { institution: string; degree: string; field: string; startDate: Date | null; endDate: Date | null; };
};

const inputStyle = "w-full px-4 py-2 bg-white border border-platinum rounded-lg focus:ring-2 focus:ring-orange-web/50 focus:border-orange-web outline-none transition-colors duration-200";

export default function Profile() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormFields>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      const initialData = {
        ...userInfo,
        phoneNumber: userInfo.phoneNumber || "",
        profile: userInfo.profile || { bio: '', socialURL: { linkedin: '', github: '', website: '' } },
        education: userInfo.education || { institution: '', degree: '', field: '' },
      };
      reset(initialData);
      setStartDate(userInfo.education?.startDate ? new Date(userInfo.education.startDate) : null);
      setEndDate(userInfo.education?.endDate ? new Date(userInfo.education.endDate) : null);
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: FormFields) => {
    try {
      const user = await updateUser({ ...data, education: { ...data.education, startDate, endDate } }).unwrap();
      dispatch(setCredentials(user));
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) { toast.error("Profile update failed"); }
  };

  const avatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const url = await updateAvatar(e.target.files[0]).unwrap();
        dispatch(setAvatar(url.avatarUrl));
        toast.success("Avatar updated successfully");
      } catch (err) { toast.error("Avatar upload failed"); }
    }
  };

  const removeAvatar = async () => {
    try {
      await deleteAvatar(null).unwrap();
      dispatch(setAvatar(undefined)); 
      toast.success("Avatar removed");
    } catch (err) { toast.error("Failed to remove avatar"); }
  };

  return (
    <div className="bg-platinum min-h-screen">
      <NavBar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-oxford-blue mb-2">Profile Settings</h1>
          <p className="text-oxford-blue/80">Manage your account information and preferences.</p>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-platinum rounded-xl p-6 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                {isUpdatingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-full"><Spinner size="3" /></div>
                ) : (
                  <>
                    <Avatar src={userInfo?.avatarURL} fallback={userInfo?.firstName?.charAt(0).toUpperCase() || "U"} radius="full" size="8" className="w-32 h-32 shadow-md" color="gray"/>
                    <label htmlFor="avatarInput" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-300">
                      <UploadIcon width={24} height={24} /><span className="ml-2 text-sm font-medium">Change</span>
                    </label>
                    <input id="avatarInput" type="file" accept="image/png, image/jpeg" className="hidden" onChange={avatarChange} />
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold text-oxford-blue">{userInfo?.firstName} {userInfo?.lastName}</h2>
              <p className="text-sm text-oxford-blue/70 mb-4">{userInfo?.email}</p>
              {userInfo?.avatarURL && <button type="button" onClick={removeAvatar} className="text-sm text-red-600 hover:underline cursor-pointer">Remove Avatar</button>}
            </div>
            <div className="bg-white border border-platinum rounded-xl p-6 shadow-sm">
              <label htmlFor="bio" className="block text-md font-semibold text-oxford-blue mb-3">Bio</label>
              <textarea id="bio" rows={5} placeholder="Tell us about yourself..." {...register("profile.bio")} className={`${inputStyle} resize-none`}/>
            </div>
          </aside>
          <div className="lg:col-span-2 bg-white border border-platinum rounded-xl p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><User size={16}/>First Name</label>
                <input type="text" {...register("firstName", { required: "First Name is required" })} className={inputStyle} placeholder="Bob"/>
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><User size={16}/>Last Name</label>
                <input type="text" {...register("lastName", { required: "Last Name is required" })} className={inputStyle} placeholder="Ross"/>
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><EnvelopeClosedIcon/>Email Address</label>
                <input type="email" {...register("email", { required: "Email is required" })} className={inputStyle} placeholder="bob.ross@example.com"/>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><Phone size={16}/>Phone Number</label>
                <input type="tel" {...register("phoneNumber")} className={inputStyle} placeholder="(123) 456-7890"/>
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>
            {userInfo?.role === "applicant" && (
              <div className="space-y-4 border border-platinum bg-oxford-blue/5 p-6 rounded-xl">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-oxford-blue" />
                  <h3 className="text-lg font-semibold text-oxford-blue">Education</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-oxford-blue mb-2">Institution</label>
                    <input type="text" {...register("education.institution")} className={inputStyle} placeholder="University Name"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oxford-blue mb-2">Degree</label>
                    <input type="text" {...register("education.degree")} className={inputStyle} placeholder="Bachelor of Science"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-oxford-blue mb-2">Field of Study</label>
                  <input type="text" {...register("education.field")} className={inputStyle} placeholder="Computer Science"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-oxford-blue mb-2">Time Period</label>
                  <div className="flex items-center gap-2">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className={inputStyle} placeholderText="Start Date" />
                    <ArrowRight size={16} className="text-gray-400"/>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className={inputStyle} placeholderText="End Date" />
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4 border border-platinum bg-oxford-blue/5 p-6 rounded-xl">
              <div className="flex items-center gap-2">
                  <Link1Icon />
                  <h3 className="text-lg font-semibold text-oxford-blue">Social & Professional Links</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><LinkedInLogoIcon className="text-blue-700"/>LinkedIn</label>
                  <input type="url" {...register("profile.socialURL.linkedin")} className={inputStyle} placeholder="https://linkedin.com/in/..."/>
                </div>
                {userInfo?.role === "applicant" 
                  ? <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><GitHubLogoIcon/>GitHub</label>
                      <input type="url" {...register("profile.socialURL.github")} className={inputStyle} placeholder="https://github.com/..."/>
                    </div>
                  : <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-oxford-blue mb-2"><Link1Icon/>Company Website</label>
                      <input type="url" {...register("profile.socialURL.website")} className={inputStyle} placeholder="https://yourwebsite.com"/>
                    </div>
                }
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isLoading} className="px-8 py-3 bg-orange-web text-oxford-blue rounded-lg font-bold focus:ring-2 focus:ring-orange-web/50 focus:outline-none cursor-pointer hover:bg-orange-web/90 transition-all duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Saving...' : 'Update Profile'}
                {isLoading && <Spinner className="ml-2"/>}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}