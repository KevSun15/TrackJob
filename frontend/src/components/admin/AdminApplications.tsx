import { useState, useEffect } from 'react';
import { Briefcase, MapPin, User, Calendar, ChevronRight, Inbox } from 'lucide-react';
import { type RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useGetMyJobsMutation } from "../../redux/apiSlices/jobsApiSlice";
import { useGetMyApplicationsMutation } from '../../redux/apiSlices/applicationsApiSlice';
import { setAllAdminJobs } from '@/redux/jobSlice';
import { setApplications } from '@/redux/applicationSlice';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { Avatar } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { setSingleApplication } from '../../redux/applicationSlice';

const getStatusColor = (status : string) => {
    switch (status) {
        case 'Pending': return 'bg-orange-web text-white';
        case 'Rejected': return 'bg-red-800 text-white';
        case 'Hired': return 'bg-green-800 text-white';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export function RecruiterDashboard() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { allApplications } = useSelector((state: RootState) => state.applications);
  const { allAdminJobs} = useSelector((state: RootState) => state.jobs);
  const dispatch = useDispatch();
  const [getMyJobs] = useGetMyJobsMutation();
  const [getApplications] = useGetMyApplicationsMutation();
  const navigate = useNavigate();


  useEffect(() => {  
      const fetchJobsAndApplications = async () => {
        try {
          const jobs = await getMyJobs(null).unwrap();
          const applications = await getApplications(null).unwrap(); 
          dispatch(setAllAdminJobs(jobs));
          dispatch(setApplications(applications));
        } catch (error) {
          console.error('Failed to fetch jobs or applications:', error);
        }
      };
      fetchJobsAndApplications();
    }, []);



  const selectedJob = allAdminJobs.find(job => job._id === selectedJobId);
  const filteredApplicants = allApplications.filter(
    (applicant) => applicant.jobId._id === selectedJobId
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <aside className="w-1/3 max-w-sm border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-gray-800">Job Postings</h1>
          <p className="text-sm text-gray-500">Select a job to view candidates.</p>
        </div>
        <div className="overflow-y-auto flex-grow">
          <ul className="divide-y divide-slate-200">
            {allAdminJobs.map((job) => {
              const isSelected = job._id === selectedJobId;
              const applicationsCount = allApplications.filter(app => app.jobId._id === job._id).length;
              return (
                <li key={job._id}>
                  <button onClick={() => setSelectedJobId(job._id)} className={`w-full text-left p-4 transition-colors ${
                    isSelected ? 'bg-sky-50' : 'hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold text-gray-900">{job.title}</h2>
                        <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        {job.companyId.location.City}, {job.companyId.location.State ? `${job.companyId.location.State}, ` : ''}{job.companyId.location.Country}
                        </p>
                      </div>
                      {applicationsCount > 0 && (
                        <span className="bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {applicationsCount}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {selectedJob ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{selectedJob.title}</h2>
            <p className="text-gray-500 mt-1">
              Showing {filteredApplicants.length} applicant(s)
            </p>
            {filteredApplicants.length > 0 ? (
                <div className="mt-8 space-y-4">
                  {filteredApplicants.map(applicant => (
                    <div key={applicant._id} className=" cursor-pointer bg-white border border-slate-200 rounded-lg p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => {navigate("/admin/application/" + applicant._id); dispatch(setSingleApplication(applicant));}}>
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-full">
                          {applicant.applicantId.avatarUrl ?<Avatar src={applicant.applicantId.avatarUrl} size="5" radius="full" fallback="" /> : <User size={30} className="text-slate-400"/>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{applicant.applicantId.firstName} {applicant.applicantId.lastName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Calendar size={14} /> Applied on {format(new Date(applicant.appliedAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                        <button className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            ) : (
                <div className="text-center mt-24">
                  <Inbox size={48} className="mx-auto text-slate-400"/>
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">No Applicants Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check back later to see new candidates for this role.
                  </p>
                </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Briefcase size={52} className="text-slate-400"/>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Welcome to your Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Please select a job posting from the left to view its applicants.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}