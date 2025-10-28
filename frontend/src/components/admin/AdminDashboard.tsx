import { useState, useEffect} from "react";
import { MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { PlusIcon} from "@radix-ui/react-icons";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from "@/components/ui/table"
import { Tabs } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useGetMyJobsMutation } from "@/redux/apiSlices/jobsApiSlice";
import { setAllAdminJobs, setSingleJob } from "../../redux/jobSlice";
import Navbar from "../Navbar";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../redux/store";
import { RecruiterDashboard } from "./AdminApplications";

const getJobTypeStyle = (jobType: string) => {
  const styles = {
    'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'part-time': 'bg-blue-50 text-blue-700 border-blue-200',
    'contract': 'bg-purple-50 text-purple-700 border-purple-200',
    'internship': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return styles[jobType.toLowerCase() as keyof typeof styles] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getWorkTypeStyle = (workType: string) => {
  const styles = {
    'remote': 'bg-green-50 text-green-700 border-green-200',
    'on-site': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'hybrid': 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return styles[workType.toLowerCase() as keyof typeof styles] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>('All-Locations');
  const [selectedType, setSelectedType] = useState<string | undefined>('All Types');
  const [getMyJobs, { isLoading }] = useGetMyJobsMutation();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((state: RootState) => state.jobs);
  const [filteredJobs, setFilteredJobs] = useState([] as typeof allAdminJobs);
  const navigate = useNavigate();

useEffect(() => {
  let filtered = [...allAdminJobs];
  const q = searchQuery.toLowerCase();
  if (q) {
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(q) ||
      job.companyId.companyName.toLowerCase().includes(q) ||
      job.companyId.location.Country.toLowerCase().includes(q) ||
      job.companyId.location.City.toLowerCase().includes(q) ||
      (job.companyId.location.State && job.companyId.location.State.toLowerCase().includes(q))
    );
  }
  if (selectedLocation && selectedLocation !== "All-Locations") {
    filtered = filtered.filter(job => job.workType.toLowerCase() === selectedLocation.toLowerCase());
  }
  if (selectedType && selectedType !== "All Types") {
    filtered = filtered.filter(job => job.jobType.toLowerCase() === selectedType.toLowerCase());
  }

  setFilteredJobs(filtered);
}, [searchQuery, selectedType, selectedLocation, allAdminJobs]);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getMyJobs(null).unwrap();
        dispatch(setAllAdminJobs(jobs));
        setFilteredJobs(jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <Navbar />
      <Tabs.Root defaultValue="Jobs" className="max-w-7xl mx-auto p-4">
        <Tabs.List highContrast>
          <Tabs.Trigger value="Jobs">All Jobs</Tabs.Trigger>
          <Tabs.Trigger value="Applications">Applications</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Jobs">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Job Postings</h1>
                <p className="text-slate-600">Manage and track your posted positions</p>
              </div>
              <button onClick={() => {navigate("/admin/jobs/create"); dispatch(setSingleJob(null));}} className="bg-oxford-blue cursor-pointer text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-oxford-blue/95 flex items-center gap-2">
                Post New Job
              </button>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-md mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search jobs by role, company, or location..." className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition-all bg-white" onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-4">
                  <Select value={selectedType} onValueChange={(value) => {setSelectedType(value);}}>
                    <SelectTrigger className="w-[180px] cursor-pointer px-4 py-6 border border-slate-300 rounded-lg bg-white">
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 rounded-lg shadow-xl">
                      <SelectGroup>
                        <SelectLabel className="text-slate-700 font-semibold">Job Type</SelectLabel>
                        <SelectItem value="All Types" className="hover:bg-slate-50">All Types</SelectItem>
                        <SelectItem value="full-time" className="hover:bg-gray-50">Full-time</SelectItem>
                        <SelectItem value="part-time" className="hover:bg-gray-50">Part-time</SelectItem>
                        <SelectItem value="contract" className="hover:bg-gray-50">Contract</SelectItem>
                        <SelectItem value="internship" className="hover:bg-gray-50">Internship</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select value={selectedLocation} onValueChange={(value) => {setSelectedLocation(value);}}>
                    <SelectTrigger className="w-[180px] cursor-pointer px-4 py-6 border border-slate-300 rounded-lg bg-white">
                      <SelectValue placeholder="Select Work Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 rounded-lg shadow-xl">
                      <SelectGroup>
                        <SelectLabel className="text-slate-700 font-semibold">Work Type</SelectLabel>
                        <SelectItem value="All-Locations" className="hover:bg-gray-50">All Locations</SelectItem>
                        <SelectItem value="remote" className="hover:bg-gray-50">Remote</SelectItem>
                        <SelectItem value="on-site" className="hover:bg-gray-50">On-site</SelectItem>
                        <SelectItem value="hybrid" className="hover:bg-gray-50">Hybrid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="bg-white max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="max-h-[500px] overflow-y-auto">
                <Table className="table-fixed w-full">
                  <TableHeader className="bg-slate-50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[120px] px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Job Type</TableHead>
                      <TableHead className="w-[120px] px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Work Type</TableHead>
                      <TableHead className="px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Company</TableHead>
                      <TableHead className="px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Role</TableHead>
                      <TableHead className="w-[180px] px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</TableHead>
                      <TableHead className="w-[120px] px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Posted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {filteredJobs.map((job, index) => (
                      <TableRow className="hover:bg-slate-50 cursor-pointer transition-colors" key={index} onClick={() => {navigate("/admin/jobs/create"); dispatch(setSingleJob(job));}}>
                        <TableCell className="p-4 w-[120px]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getJobTypeStyle(job.jobType)}`}>
                            {job.jobType}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 w-[120px]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getWorkTypeStyle(job.workType)}`}>
                            {job.workType}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 font-medium text-slate-900">{job.companyId.companyName}</TableCell>
                        <TableCell className="p-4 font-semibold text-slate-900">{job.title}</TableCell>
                        <TableCell className="p-4 w-[180px] text-sm text-slate-600">
                          {job.companyId.location.City}, {job.companyId.location.State || job.companyId.location.Country}
                        </TableCell>
                        <TableCell className="p-4 w-[120px] text-sm text-slate-600">
                          {new Date(job.postedAt).toLocaleDateString('en-US')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-slate-50 sticky bottom-0 border-t border-slate-200">
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold text-slate-700">Total Jobs</TableCell>
                      <TableCell colSpan={2} className="text-right font-bold text-slate-900 text-lg">{filteredJobs.length}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="Applications">
            <RecruiterDashboard />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}