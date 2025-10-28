import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { Search, CircleDollarSign, Briefcase, Laptop, MapPin, ChevronDown, Building, Clock, Link } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useGetAllJobsMutation } from "@/redux/apiSlices/jobsApiSlice";
import { type RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAllJobs, setSingleJob } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Spinner } from "@radix-ui/themes";
import { setApplications } from "@/redux/applicationSlice";
import { useGetMyApplicationsMutation } from "../redux/apiSlices/applicationsApiSlice";

const FilterDropdown = ({ title, options, selected, onToggle } : { title: string; options: string[]; selected: string[]; onToggle: (option: string) => void; }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-gray-50">
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
          {options.map((option: string) => (
            <label key={option} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={selected.includes(option)}
                onChange={() => onToggle(option)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"/>
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Browse() {
  const { allJobs } = useSelector((state: RootState) => state.jobs);
  const [getAllJobs, { isLoading }] = useGetAllJobsMutation();
  const { searchQuery } = useSelector((state: RootState) => state.jobs);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery?.split(" ")[0] || "");
  const [searchLocation, setSearchLocation] = useState<string>(searchQuery?.split(" ")[1] || "");
  const [salary, setSalary] = useState<number>(0);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<(typeof allJobs)[0] | null>(null);
  const [date, setDate] = useState<"newest" | "oldest" | "">("newest");
  const { allApplications} = useSelector((state: RootState) => state.applications);
  const [ getAllApplications ] = useGetMyApplicationsMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs(null).unwrap();
        dispatch(setAllJobs(jobs));
        const applications = await getAllApplications(null).unwrap();
        dispatch(setApplications(applications));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.companyId.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = searchLocation ? (job.companyId.location.City.toLowerCase().includes(searchLocation.toLowerCase()) || job.companyId.location.State?.toLowerCase().includes(searchLocation.toLowerCase()) || job.companyId.location.Country.toLowerCase().includes(searchLocation.toLowerCase())) : true;
    const matchesSalary = Number(job.salary) >= salary;
    const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType);
    const matchesWorkType = selectedWorkTypes.length === 0 || selectedWorkTypes.includes(job.workType);
    return matchesSearch && matchesLocation && matchesSalary && matchesJobType && matchesWorkType;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-6 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1">
          <div className="lg:col-span-2 flex flex-col max-h-[80vh] bg-white pl-2 pt-2 rounded-md border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-3 mt-2 pl-3">{filteredJobs.length} Job postings</h2>
            <div className="space-y-2 overflow-y-auto pr-4 flex-1 pl-2 pt-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner size="3" />
                </div>
              ) : (
                filteredJobs.length > 0 ? filteredJobs.map(job => (
                  <div key={job._id} onClick={() => setSelectedJob(job)}
                    className={`p-4 bg-white rounded-lg border cursor-pointer transition-all duration-200 ${selectedJob?._id === job._id ? 'border-blue-500 shadow-md scale-[1.02]' : 'border-slate-200 hover:shadow-sm hover:border-slate-300'}`}>
                  <div className="flex items-center gap-4">
                    <Avatar src={job.companyId.logoUrl} size="5" fallback={job.companyId.companyName.charAt(0)}/>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
                      <p className="text-slate-700">{job.companyId.companyName}</p>
                      <p className="text-sm text-slate-500">{job.companyId.location ? `${job.companyId.location.City}, ${job.companyId.location.State}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-2 text-slate-600">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Briefcase className="w-4 h-4" /> {job.jobType}</span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Laptop className="w-4 h-4" /> {job.workType}</span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-500 py-12">No jobs match your criteria.</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div className="relative flex gap-2">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search by title, company..." className="w-full pl-12 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none bg-white" 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <input type="text" placeholder="Location..." className="w-1/3 pl-4 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none bg-white" 
                    value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}/>
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={date} onValueChange={(value) => {setDate(value as "newest" | "oldest" | "");}}>
                    <SelectTrigger className="w-[130px] cursor-pointer px-4 py-6 border border-slate-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none shadow-none focus:ring-0">
                      <SelectValue placeholder="Sort By Date" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 rounded-lg">
                      <SelectGroup>
                        <SelectLabel className="text-slate-700 font-semibold">Sort By</SelectLabel>
                        <SelectItem value=" " className="hover:bg-slate-50">All Dates</SelectItem>
                        <SelectItem value="newest" className="hover:bg-gray-50">Newest</SelectItem>
                        <SelectItem value="oldest" className="hover:bg-gray-50">Oldest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>   
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 flex items-center gap-2 text-sm mb-2">
                      <CircleDollarSign className="w-4 h-4" /> Minimum Salary: <span className="font-bold text-slate-900">${salary.toLocaleString()}</span>
                    </label>
                    <input type="range" value={salary} onChange={(e) => setSalary(parseInt(e.target.value, 10))}
                      min="0" max="300000" step="10000" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <FilterDropdown title="Job Type" options={['Full-time', 'Part-time', 'Contract', 'Internship']} selected={selectedJobTypes} onToggle={(type: string) => handleFilterChange(setSelectedJobTypes, type)} />
                  <FilterDropdown title="Work Style" options={['On-site', 'Remote', 'Hybrid']} selected={selectedWorkTypes} onToggle={(work: string) => handleFilterChange(setSelectedWorkTypes, work)} />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              {selectedJob ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <span className="flex items-center gap-2"><Building className="w-5 h-5"/>{selectedJob.jobType}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/>{selectedJob.companyId.location ? `${selectedJob.companyId.location.City}, ${selectedJob.companyId.location.State}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4 ml-0.5" /> Posted {selectedJob.postedAt} ago
                  </div>
                  {selectedJob.salary && (
                    <>
                      <div className="my-4 border-t border-slate-200"></div>
                      <p className="text-lg font-semibold text-slate-800">Salary Range</p>
                      <p className="text-2xl font-bold text-green-600">${selectedJob.salary.toLocaleString()} / year</p>
                    </>
                  )}
                  {selectedJob.description && ( 
                    <>
                      <div className="my-4 border-t border-slate-200"></div>
                      <h3 className="font-semibold text-slate-800 mb-6">Job Description</h3>
                      <p className="text-slate-600 whitespace-pre-wrap">{selectedJob.description}</p>
                    </>
                  )}
                  {selectedJob.skills && (
                    <>
                      <div className="my-4 border-t border-slate-200  "></div>
                      <h3 className="font-semibold text-slate-800 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map(skill => (
                          <span key={skill} className="bg-oxford-blue text-white px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="p-3 border mt-10 rounded-md border-slate-200 bg-slate-50">
                    <h1 className="text-lg font-semibold text-slate-800 mb-2">About {selectedJob.companyId.companyName}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <Link /> {selectedJob.companyId.website && (
                        <a href={selectedJob.companyId.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-800 hover:text-blue-900 hover:underline">
                          {selectedJob.companyId.website}
                        </a>
                      )}
                    </div>
                    <p className = "text-slate-600 mt-5">{selectedJob.companyId.description}</p>
                  </div>
                  {userInfo?.role === 'applicant' ? (
                    <>{allApplications.find(app => app.jobId._id === selectedJob._id) ? (
                      <button className="mt-8 w-full bg-gray-300 text-gray-600 font-bold cursor-not-allowed py-3 px-4 rounded-lg sticky bottom-0 transition-colors" disabled>
                        Applied
                      </button>
                    ) : (
                      <button className="mt-8 w-full bg-oxford-blue text-white font-bold cursor-pointer py-3 px-4 rounded-lg hover:bg-oxford-blue/90 sticky bottom-0 transition-colors"
                        onClick={() => {navigate('/job/' + selectedJob._id); dispatch(setSingleJob(selectedJob));}}>
                        Apply Now
                      </button>
                  )}</>) : (<>{userInfo?.role === 'recruiter' ? (
                      <button className="mt-8 w-full bg-gray-300 text-gray-600 font-bold cursor-not-allowed py-3 px-4 rounded-lg sticky bottom-0 transition-colors" disabled>
                        Not Applicant
                      </button>
                  ) : (
                    <button className="mt-8 w-full bg-gray-300 text-gray-600 font-bold cursor-not-allowed py-3 px-4 rounded-lg sticky bottom-0 transition-colors" disabled>
                      Not Applicant
                    </button>
                  )}</>)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-500">Select a job to see the details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}