import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from "../Navbar";
import { toast } from 'sonner';
import { Spinner } from '@radix-ui/themes';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminCompanies } from '../../redux/companySlice';
import { useCreateJobMutation, useUpdateJobMutation } from '../../redux/apiSlices/jobsApiSlice';
import { useGetAllCompaniesMutation } from "../../redux/apiSlices/companyApiSlice";
import { setAllAdminJobs } from "../../redux/jobSlice";
import type { RootState } from '../../redux/store';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSignIcon, SquarePenIcon, NotepadText, Briefcase, MapPin } from 'lucide-react';


type JobFormData = {
  title: string;
  description: string;
  salary: string;
  location: { Country: string; City: string; Address: string; };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workType: 'on-site' | 'remote' | 'hybrid';
  company: string;
  skills: { value: string }[];
  companyId: string;
};

const inputStyle = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-oxford-blue focus:border-oxford-blue outline-none transition-colors duration-200 text-oxford-blue placeholder:text-gray-400";
const labelStyle = "flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-2";

export default function JobCreate() {
  const { singleJob } = useSelector((state: RootState) => state.jobs);
  const [createJob, { isLoading }] = useCreateJobMutation();
  const { adminCompanies } = useSelector((state: RootState) => state.companies);
  const { allAdminJobs } = useSelector((state: RootState) => state.jobs);
  const [getAllCompanies] = useGetAllCompaniesMutation();
  const [updateJob] = useUpdateJobMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = !!singleJob; 

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<JobFormData>({
    defaultValues: {
      title: singleJob?.title || '',
      description: singleJob?.description || '',
      salary: singleJob?.salary || '',
      jobType: singleJob?.jobType || 'full-time',
      workType: singleJob?.workType || 'on-site',
      company: singleJob?.companyId._id || '',
      companyId: singleJob?.companyId._id || '',
      skills: singleJob?.skills.map(skill => ({ value: skill })) || [{ value: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills"
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companies = await getAllCompanies(null).unwrap();
        dispatch(setAdminCompanies(companies));
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };
    fetchCompanies();
  }, [dispatch, getAllCompanies]);

  const onSubmit = async (data: JobFormData) => {
    try {
      const skillsArray = data.skills.map(skill => skill.value).filter(skill => skill.trim() !== '');
      const jobData = { ...data, skills: skillsArray };
      let job;
      if (isEditMode) {
        job = await updateJob({ id: singleJob._id, ...jobData }).unwrap();
      } else {
        job = await createJob(jobData).unwrap();
        dispatch(setAllAdminJobs([...allAdminJobs, job]));
      }
      toast.success(`Job ${isEditMode ? 'updated' : 'posted'} successfully!`);
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.`);
    }
  };

  return (
    <div className="bg-platinum min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-oxford-blue">{isEditMode ? 'Edit Job Posting' : 'Post New Job'}</h1>
            <p className="text-oxford-blue/70 mt-1">{isEditMode ? 'Update the details for this job listing.' : 'Create a new job posting to attract qualified candidates.'}</p>
          </div>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-platinum p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className={labelStyle}><SquarePenIcon size={16} /> Job Title <span className="text-red-500">*</span></label>
              <input type="text" {...register("title", { required: "Job title is required" })}
                className={inputStyle} placeholder="e.g., Senior Frontend Developer" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Company <span className="text-red-500">*</span></label>
                <Controller name="company" control={control} rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={inputStyle}><SelectValue placeholder="Select a company" /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectLabel>Companies</SelectLabel>
                          {adminCompanies.map((company) => (
                            <SelectItem className="hover:bg-gray-200 cursor-pointer" key={company._id} value={company._id}>{company.companyName}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )} />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
              </div>
              <div>
                <label className={labelStyle}><DollarSignIcon size={16} /> Salary Range</label>
                <input type="text" {...register("salary")} className={inputStyle} placeholder="e.g., $30,000 - $120,000" />
              </div>
            </div>
            <div className="p-5 rounded-lg bg-gray-100 border border-platinum space-y-4">
              <label className={labelStyle}><Briefcase size={16} /> Job Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller name="jobType" control={control} rules={{ required: "Job type is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={inputStyle}><SelectValue placeholder="Select Job Type" /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup><SelectLabel>Job Type</SelectLabel>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="full-time">Full-time</SelectItem>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="part-time">Part-time</SelectItem>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="contract">Contract</SelectItem>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="internship">Internship</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )} />
                <Controller name="workType" control={control} rules={{ required: "Work type is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={inputStyle}><SelectValue placeholder="Select Work Type" /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup><SelectLabel>Work Type</SelectLabel>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="on-site">On-site</SelectItem>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer" value="remote">Remote</SelectItem>
                          <SelectItem className="hover:bg-gray-200 cursor-pointer"value="hybrid">Hybrid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelStyle}>Required Skills</label>
                <button type="button" onClick={() => append({ value: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-oxford-blue hover:bg-oxford-blue/5 rounded-md transition-colors">
                  <PlusIcon className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input type="text" {...register(`skills.${index}.value` as const)} className={inputStyle} placeholder="e.g., React, TypeScript, GraphQL" />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-2 text-oxford-blue/60 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className={labelStyle}><NotepadText size={16} /> Job Description</label>
              <textarea {...register("description")} rows={5} className={inputStyle} placeholder="Describe the job responsibilities, requirements, and benefits..." />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-platinum">
              <button type="button" onClick={() => navigate("/admin/jobs")} className="w-full cursor-pointer px-4 py-3 bg-white border border-gray-300 text-oxford-blue rounded-lg hover:bg-gray-50 transition-colors font-bold">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="w-full flex cursor-pointer items-center justify-center px-4 py-3 bg-oxford-blue text-orange-web rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-web/50 disabled:opacity-70">
                {isLoading ? <Spinner /> : isEditMode ? 'Save Changes' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}