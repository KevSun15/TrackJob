
import { Box } from '@radix-ui/themes';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { useLoginMutation } from '../redux/usersApiSlice';
import type { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import { setCredentials } from '../redux/authSlice';
import { Spinner } from '@radix-ui/themes';
import type { AppDispatch } from '../redux/store';

type FormFields = {
  email: string;
  password: string;
}



export default function Login(){


    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    const dispatch : AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUser, {isLoading}] = useLoginMutation();


    const onSubmit = async(data: FormFields) => {
      try {
        const user = await loginUser(data).unwrap();
        dispatch(setCredentials(user));
        navigate('/');
        toast.success("User Logged in successfully!");
      } catch (error: any) {
          toast.error(error?.data?.message || error?.error || 'Registration Failed');
      }
    }

    return(
      <div className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-slate-100 to-indigo-200"> 
        <Box width="550px" className="bg-white rounded-xl shadow-2xl p-8 min-h-[500px]">
          <NavLink className="hover:underline" to="/"> Back </NavLink>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
          </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit" className="w-full flex justify-center bg-blue-500 cursor-pointer text-white py-3 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500 transition-colors mt-6">
            {isLoading ? <Spinner/> : "Login" }
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Get started today!{' '}
              <NavLink to="/Register" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                Register here
              </NavLink>
            </p>
          </div>
        </form>
      </Box>
    </div>
    )
}