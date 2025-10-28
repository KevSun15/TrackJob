import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { useRegisterMutation } from '../redux/apiSlices/usersApiSlice';
import { toast } from "sonner";
import { setCredentials } from '../redux/authSlice';
import { Spinner, RadioCards } from '@radix-ui/themes';
import type { AppDispatch } from '../redux/store';
import { LayersIcon, EnvelopeClosedIcon, LockClosedIcon, PersonIcon } from '@radix-ui/react-icons';
import { Briefcase, UserSearch } from 'lucide-react';

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "applicant" | "recruiter";
}

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [role, setRole] = useState<'applicant' | 'recruiter'>('applicant');

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
        const user = await registerUser({ ...data, role }).unwrap();
        dispatch(setCredentials(user));
        navigate('/');
        toast.success("User registered successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || error?.error || 'Registration Failed');
      }
    }
    const inputStyle = "w-full pl-10 pr-4 py-3 border border-platinum rounded-lg focus:ring-1 focus:ring-oxford-blue focus:border-oxford-blue outline-none transition-colors duration-200";

    return (
      <div className="w-full min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center items-center bg-oxford-blue text-white p-12">
          <NavLink to='/' className="flex items-center group mb-6">
            <LayersIcon width="60" height="60" className="p-3 rounded-xl shadow-lg bg-orange-web text-oxford-blue"/>
            <div className="ml-4">
              <h1 className="text-white text-5xl font-bold tracking-tight">
                Track<span className="text-orange-web">Job</span>
              </h1>
            </div>
          </NavLink> 
          <p className="text-center text-lg text-platinum/80">
            Your professional journey, organized.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full bg-platinum p-8">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-oxford-blue mb-2">Create an Account</h1>
              <p className="text-oxford-blue/70">Start your journey with TrackJob today.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input type="text" {...register("firstName", { required: "First name is required" })} className={inputStyle} placeholder="First Name"/>
                  {errors.firstName && (<p className="text-red-500 text-sm mt-1 absolute">{errors.firstName.message}</p>)}
                </div>
                <div className="relative">
                  <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input type="text" {...register("lastName", { required: "Last Name is required" })} className={inputStyle} placeholder="Last Name"/>
                  {errors.lastName && (<p className="text-red-500 text-sm mt-1 absolute">{errors.lastName.message}</p>)}
                </div>
              </div>
              <div className="relative">
                <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }})} className={inputStyle} placeholder="you@example.com"/>
                {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="password" {...register("password", { required: "Password is required" })} className={inputStyle} placeholder="••••••••"/>
                {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
              </div>
              <div>
                <RadioCards.Root defaultValue="applicant" columns={{ initial: "1", sm: "2" }} gap="4" onValueChange={(value: "applicant" | "recruiter") => setRole(value)} color={"gray"}>
                  <RadioCards.Item value="applicant" className="p-4 group">
                    <div className="flex items-center gap-4">
                      <Briefcase className="w-8 h-8 text-oxford-blue/80 group-data-[state=checked]:text-orange-web"/>
                      <div>
                        <h2 className="font-semibold text-oxford-blue">Applicant</h2>
                        <p className="text-sm text-gray-500">Find and apply for jobs.</p>
                      </div>
                    </div>
                  </RadioCards.Item>
                  <RadioCards.Item value="recruiter" className="p-4 group">
                    <div className="flex items-center gap-4">
                      <UserSearch className="w-8 h-8 text-oxford-blue/80 group-data-[state=checked]:text-orange-web"/>
                      <div>
                        <h2 className="font-semibold text-oxford-blue">Recruiter</h2>
                        <p className="text-sm text-gray-500">Post jobs and find talent.</p>
                      </div>
                    </div>
                  </RadioCards.Item>
                </RadioCards.Root>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-orange-web text-oxford-blue py-3 rounded-lg font-bold hover:bg-orange-web/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-web/50 disabled:opacity-70">
                {isLoading ? <Spinner /> : "Create Account"}
              </button>
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <NavLink to="/login" className="font-semibold text-orange-web hover:underline">
                    Sign in here
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}