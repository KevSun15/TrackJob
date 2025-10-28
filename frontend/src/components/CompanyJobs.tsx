import { Globe, Briefcase, MapPin, Clock } from 'lucide-react';
import type { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@radix-ui/themes";
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGetCompanyJobsMutation } from '../redux/apiSlices/jobsApiSlice';
import { setCompanyJobs } from '@/redux/jobSlice';
import Navbar from './Navbar';

export default function CompanyJobs() {

  const { singleCompany } = useSelector((state: RootState) => state.companies);
  const { allCompanyJobs } = useSelector((state: RootState) => state.jobs);
  const [getCompanyJobs] = useGetCompanyJobsMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchCompanyJobs = async () => {  
      if (!singleCompany) {
        navigate('/companies');
        return; 
      }
      try {
        const jobs = await getCompanyJobs(singleCompany?._id).unwrap();
        console.log("Company Jobs:", jobs);
        dispatch(setCompanyJobs(jobs));
      } catch (error) {
        console.error("Failed to fetch company jobs:", error);
      }
    };

    fetchCompanyJobs();
  }, [singleCompany, navigate, dispatch, getCompanyJobs]);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <header className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
        <div className="max-w-5xl mx-auto px-8 py-8 text-center">
          <div className="inline-block p-1 bg-white/20 rounded-2xl">
            <Avatar src={singleCompany?.logoUrl}  fallback={singleCompany?.companyName?.charAt(0) || "C"} size="8" radius="medium" className="shadow-xl"/>
          </div>
          <h1 className="text-5xl font-bold text-white mt-6">{singleCompany?.companyName}</h1>
          <a href={singleCompany?.website} target="_blank"  rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mt-3">
            <Globe size={16} />
            <span>{singleCompany?.website}</span>
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About {singleCompany?.companyName}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {singleCompany?.description}
              </p>
            </div>
          </aside>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Open Positions ({allCompanyJobs.length})</h2>
            <div className="space-y-4">
              {allCompanyJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-oxford-blue/50">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                      <p className="flex items-center gap-1.5"><MapPin size={14} />{singleCompany?.location?.City}, {singleCompany?.location?.Country}</p>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <p className="flex items-center gap-1.5"><Briefcase size={14} />{job.jobType}</p>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <p className="flex items-center gap-1.5"><Clock size={14} />{job.workType}</p>
                    </div>
                  </div>
                  <button className="px-5 py-2 text-sm bg-gray-100 text-oxford-blue font-semibold rounded-lg hover:bg-oxford-blue hover:text-white transition-colors self-start sm:self-center flex-shrink-0 cursor-pointer">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}