import { useState, useEffect} from 'react';
import { Briefcase, MapPin, User, Calendar, ChevronRight, Building, Inbox } from 'lucide-react';
import Navbar from '../Navbar'; 
import * as Accordion from '@radix-ui/react-accordion';
import { type RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useGetMyJobsMutation } from '../../redux/apiSlices/jobsApiSlice';
import { useGetMyApplicationsMutation } from '../../redux/apiSlices/applicationsApiSlice';
import { type Application } from '../../redux/applicationSlice';
import { type Job } from '../../redux/jobSlice';
import { format } from 'date-fns/format';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-orange-web text-white';
        case 'Hired': return 'bg-green-800 text-white';
        case 'Rejected': return 'bg-red-800 text-white';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export function AdminCompanyDashboard() {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const { singleCompany } = useSelector((state: RootState) => state.companies);
  const [getMyJobs] = useGetMyJobsMutation();
  const [getMyApplications] = useGetMyApplicationsMutation();
  const [allApplications, setAllApplications] = useState<Application[]>([]);

  useEffect(() => {
      const fetchJobs = async () => {
        try {
          const jobs = await getMyJobs(null).unwrap();
          setFilteredJobs(jobs.filter((job: typeof jobs[0]) => job.companyId._id === singleCompany?._id));
          const applications = await getMyApplications(null).unwrap();
          setAllApplications(applications);
        } catch (error) {
          console.error('Failed to fetch jobs:', error);
        }
      };
      fetchJobs();
    }, []); 

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{singleCompany?.companyName}</h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
             <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Building size={24}/>
                Active Jobs at {singleCompany?.companyName}
             </h2>
          </div>
          <Accordion.Root type="multiple" className="divide-y divide-slate-200">
            {filteredJobs.length > 0 ? filteredJobs.map(job => {
              const applicants = allApplications.filter(app => app.jobId._id === job._id);
              return (
                  <Accordion.Item key={job._id} value={`job-${job._id}`}>
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full p-6 text-left hover:bg-slate-50 transition-colors group">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <p className="flex items-center gap-1.5"><MapPin size={14} />{job.companyId.location.City}, {job.companyId.location.State}, {job.companyId.location.Country}</p>
                              <p className="flex items-center gap-1.5"><Briefcase size={14} />{job.jobType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
                              {applicants.length} Applicant(s)
                            </span>
                            <ChevronRight size={20} className="text-slate-400 transition-transform group-data-[state=open]:rotate-90" />
                          </div>
                        </div>
                      </Accordion.Trigger>
                    </Accordion.Header>
                      <Accordion.Content className="bg-slate-50/70 p-6 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                        {applicants.length > 0 ? (
                          <div className="space-y-3">
                            {applicants.map(applicant => (
                                <div key={applicant._id} className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-full">
                                      <User className="text-slate-600" size={16} />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-sm text-gray-900">{applicant.applicantId.firstName} {applicant.applicantId.lastName}</p>
                                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <Calendar size={12} /> Applied on {format(new Date(applicant.appliedAt), 'MMM dd, yyyy')}
                                      </p>
                                    </div>
                                  </div>
                                    <div className="flex items-center gap-4">
                                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(applicant.status)}`}>
                                        {applicant.status}
                                      </span>
                                      <button className="text-sm font-semibold text-sky-600 hover:text-sky-800">
                                        View
                                      </button>
                                    </div>
                                  </div>
                              ))}
                              </div>
                          ) : (
                              <div className="text-center py-4">
                                <Inbox size={32} className="mx-auto text-slate-400"/>
                                <h4 className="mt-2 text-sm font-semibold text-gray-600">No Applicants Yet</h4>
                                <p className="text-xs text-gray-500">Check back later for new candidates.</p>
                              </div>)}
                  </Accordion.Content>
                </Accordion.Item>);
            }) : (
                <div className="p-6 text-center text-slate-500">
                  No active jobs found for this company.
                </div>
            )}
          </Accordion.Root>
        </div>
      </main>
    </div>
  );
}