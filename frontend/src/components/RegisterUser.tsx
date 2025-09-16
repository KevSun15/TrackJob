import { Box, RadioCards } from '@radix-ui/themes';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { useRegisterMutation } from '../redux/usersApiSlice';
import type { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import { setCredentials } from '../redux/authSlice';
import { Spinner } from '@radix-ui/themes';
import type { AppDispatch } from '../redux/store';

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "applicant" | "recruiter";
}


export default function Register(){

    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const dispatch : AppDispatch = useDispatch();
    const navigate = useNavigate();


    const [registerUser, { isLoading }] = useRegisterMutation();
    const [role, setRole] = useState('applicant');


    const onSubmit:  SubmitHandler<FormFields> = async(data) => {
      try {
          const user = await registerUser({...data, role}).unwrap();
          dispatch(setCredentials(user));
          navigate('/');
          toast.success("User registered successfully!");
      } catch (error: any) {
          toast.error(error?.data?.message || error?.error || 'Registration Failed');
      }
    }


    return(
      <div className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-slate-100 to-indigo-200">
        <Box width="550px" className="bg-white rounded-xl shadow-2xl p-8 min-h-[650px]">
          <NavLink className="hover:underline" to="/"> Back </NavLink>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us today and get started</p>
          </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
            <input 
              type="text" 
              {...register("firstName", {required: "First name is required"})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Bob"
            />
            {errors.firstName && (<div className="text-red-500">{errors.firstName.message}</div>)}
          </div>
       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input 
              type="text" 
              {...register("lastName", {required: "Last Name is required"})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Ross"
            />
            {errors.lastName && (<div className="text-red-500">{errors.lastName.message}</div>)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input 
            type="email" 
            {...register("email", {required: "Email is required", validate:(value: string) => {
              if (!value.includes("@")) {
                 return "Email must include @"
                } return true},
              })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Bob.Ross@example.com"
          />
          {errors.email && (<div className="text-red-500">{errors.email.message}</div>)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input 
            type="password" 
            {...register("password", {required: "Password is required"})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="••••••••"
          />
          {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}
        </div>
          <div>
            <RadioCards.Root defaultValue="applicant" columns={{ initial: "1", sm: "2" }} onValueChange={(value) => setRole(value)}>
              <RadioCards.Item value="applicant" className="focus:bg-blue-500">
                <h1> Applicant </h1>
              </RadioCards.Item>
              <RadioCards.Item value="recruiter">
                <h1> Recruiter </h1>
              </RadioCards.Item>
            </RadioCards.Root>
          </div>  
          <button type="submit" className="w-full bg-gradient-to-br from-blue-500 to-indigo-500 cursor-pointer text-white py-3 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500 transition-colors mt-6">
            {isLoading ? <Spinner /> : "Create Account" }
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <NavLink to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign in here
              </NavLink>
            </p>
          </div>
        </form>
      </Box>
    </div>
    )
}