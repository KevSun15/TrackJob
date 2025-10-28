import { Plus, MapPin, Globe, Building, Briefcase, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useGetCompaniesByRecruiterIdMutation} from '../../redux/apiSlices/companyApiSlice';
import { useDispatch } from 'react-redux';
import { setAdminCompanies, setSingleCompany } from '../../redux/companySlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { Avatar } from '@radix-ui/themes';
import { useGetMyApplicationsMutation } from '../../redux/apiSlices/applicationsApiSlice';
import Navbar from "../Navbar";
import { useGetMyJobsMutation } from '../../redux/apiSlices/jobsApiSlice';
import { setAllAdminJobs } from '../../redux/jobSlice';
import { setApplications } from '../../redux/applicationSlice';

export default function AdminCompanies() {
  const [getCompaniesByRecruiterId] = useGetCompaniesByRecruiterIdMutation();
  const [getMyJobs] = useGetMyJobsMutation();
  const [getApplications] = useGetMyApplicationsMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { adminCompanies } = useSelector((state: RootState) => state.companies);
  const { allAdminJobs } = useSelector((state: RootState) => state.jobs);
  const { allApplications } = useSelector((state: RootState) => state.applications);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 


  const jobsCount = (companyId: string) => {
    const jobs = allAdminJobs.filter(job => job.companyId._id === companyId);
    return jobs.length;
  };

  const applicantsCount = (companyId: string) => {
    const applications = allApplications.filter(app => app.jobId.companyId._id === companyId);
    return applications.length;
  };  
  
  useEffect(() => {
      const fetchCompanies = async () => {
        try {
          const companies = await getCompaniesByRecruiterId(userInfo?._id).unwrap();
          const jobs = await getMyJobs(null).unwrap();
          const applications = await getApplications(null).unwrap(); // Set fetched companies
          dispatch(setAdminCompanies(companies));
          dispatch(setApplications(applications));
          dispatch(setAllAdminJobs(jobs));
        } catch (error) {
          console.error('Failed to fetch companies:', error);
        }
      };
      fetchCompanies();
    }, []);
    
  return (
    <div>
      <Navbar />
        <div className="bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-400">
              <header className="mb-4">
                <h1 className="text-3xl font-bold text-oxford-blue">Your Companies</h1>
                <p className="text-oxford-blue/70">Select a company to manage its job postings.</p>
              </header>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {adminCompanies.map((company) => (
              <div key={company._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar src={company.logoUrl} size="6" fallback={`${company.companyName.charAt(0).toUpperCase()}`}/>
                    <div>
                      <h2 className="text-xl font-bold text-oxford-blue">{company.companyName}</h2>
                      <p className="flex items-center gap-1.5 text-sm text-oxford-blue/70"><MapPin size={16} />{company.location.Country}</p>
                      {company.website && (
                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                          <Globe size={16} />
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-800 hover:text-blue-900 hover:underline">
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {company.description || "No description available"}
                  </p>
                  <div className="space-y-3 py-4 border-t border-platinum">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm text-gray-600"><Briefcase size={20} /> Active Jobs</p>
                      <p className="font-bold text-oxford-blue">{jobsCount(company._id)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm text-gray-600"><Users size={20} /> Total Applicants</p>
                      <p className="font-bold text-oxford-blue">{applicantsCount(company._id)}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-200 flex gap-2">
                    <button onClick={() => {navigate("/admin/companies/create");dispatch(setSingleCompany(company));}} className="flex-1 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-oxford-blue cursor-pointer hover:bg-oxford-blue/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => {navigate(`/admin/companies/${company._id}`); dispatch(setSingleCompany(company));}}>
                      View Jobs
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button  onClick={() => {navigate("/admin/companies/create");dispatch(setSingleCompany(null));}} className="bg-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-200/80">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-oxford-blue font-semibold"> Create Another Company </h1>
                <Plus size={30} />
              </div>
            </button>
          </div>

          {adminCompanies.length === 0 && (
            <div className="text-center py-16">
              <Building size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies yet</h3>
              <p className="text-gray-600 mb-6">Create your first company to start posting jobs</p>
              <button className="bg-blue-800 cursor-pointer hover:bg-blue-900 text-white px-6 py-3 rounded-lg">
                Create Your First Company
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 

