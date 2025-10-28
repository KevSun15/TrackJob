import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { useLoginMutation } from '../redux/apiSlices/usersApiSlice';
import { toast } from "sonner"
import { setCredentials } from '../redux/authSlice';
import { Spinner } from '@radix-ui/themes';
import type { AppDispatch } from '../redux/store';
import { LayersIcon, EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';

type FormFields = {
  email: string;
  password: string;
}

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginMutation();

    const onSubmit = async(data: FormFields) => {
      try {
        const user = await loginUser(data).unwrap();
        dispatch(setCredentials(user));
        navigate('/');
        toast.success("User Logged in successfully!");
      } catch (error: any) {
          toast.error(error?.data?.message || error?.error || 'Login Failed');
      }
    }

    // Consistent input styling for a professional look
    const inputStyle = "w-full pl-10 pr-4 py-3 border border-platinum rounded-lg focus:ring-1 focus:ring-oxford-blue focus:border-oxford-blue outline-none transition-colors duration-200";

    return(
      <div className="w-full h-screen grid lg:grid-cols-2">
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
              <h1 className="text-3xl font-bold text-oxford-blue mb-2">Welcome Back!</h1>
              <p className="text-oxford-blue/70">Sign in to continue to TrackJob.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input 
                  type="email" 
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }})}
                  className={inputStyle}
                  placeholder="you@example.com"
                />
                {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
              </div>

              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input 
                  type="password" 
                  {...register("password", { required: "Password is required" })}
                  className={inputStyle}
                  placeholder="••••••••"
                />
                {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-orange-web py-3 rounded-lg font-bold hover:bg-orange-web/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-web/50 disabled:opacity-70">
                {isLoading ? <Spinner/> : "Sign In"}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-platinum"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-oxford-blue">New to TrackJob?</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <NavLink to="/register" className="font-semibold text-orange-web hover:underline">
                    Register here
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}