import { useState, useEffect} from "react";
import { MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from "@/components/ui/table"
import { useNavigate } from "react-router-dom";
import { useGetMyApplicationsMutation } from "@/redux/apiSlices/applicationsApiSlice";
import { setApplications, setSingleApplication } from "../redux/applicationSlice";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { BriefcaseBusiness } from "lucide-react";
import { set } from "date-fns";


const getStatusStyle = (status: string) => {
  const styles = {
    'Pending': 'bg-orange-web text-white border-yellow-200',
    'Hired': 'bg-green-800 text-white border-green-200',
    'Rejected': 'bg-red-800 text-white border-red-200',
  };
  return styles[status.toLowerCase() as keyof typeof styles] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusType, setStatusType] = useState<string | undefined>(undefined);
  const [getMyApplications, {isLoading}] = useGetMyApplicationsMutation();
  const dispatch = useDispatch();
  const { allApplications } = useSelector((state: RootState) => state.applications);
  const [filteredApplications, setFilteredApplications] = useState([] as typeof allApplications );
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = [...allApplications];
    const q = searchQuery.toLowerCase();
    if (q) {
      filtered = filtered.filter(application =>
        application.jobId.title.toLowerCase().includes(q) ||
        application.jobId.companyId.companyName.toLowerCase().includes(q) ||
        application.jobId.companyId.location.Country.toLowerCase().includes(q) ||
        application.jobId.companyId.location.City.toLowerCase().includes(q) ||
        (application.jobId.companyId.location.State && application.jobId.companyId.location.State.toLowerCase().includes(q))
      );
    }
    if (statusType && statusType !== "All Status") {
      filtered = filtered.filter(application => application.status.toLowerCase() === statusType.toLowerCase());
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusType, allApplications]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applications = await getMyApplications(null).unwrap();
        dispatch(setApplications(applications));
        setFilteredApplications(applications);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
        <div>
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
              <div className="flex gap-5 items-center ">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Applied Jobs</h1>
                <BriefcaseBusiness className="w-12 h-12 text-blue-900"/>
              </div>
              <p className="text-slate-600">Manage and track your applied positions</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-md mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search jobs by role, company, or location..." className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition-all bg-white" onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-4">
                  <Select value={statusType} onValueChange={(value) => {setStatusType(value === " " ? "" : value);}}>
                    <SelectTrigger className="w-[180px] cursor-pointer px-4 py-6 border border-slate-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-0">
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 rounded-lg shadow-xl">
                      <SelectGroup>
                        <SelectLabel className="text-slate-700 font-semibold">Status</SelectLabel>
                        <SelectItem value="All Status" className="hover:bg-slate-50">All Status</SelectItem>
                        <SelectItem value="pending" className="hover:bg-gray-50">Pending</SelectItem>
                        <SelectItem value="hired" className="hover:bg-gray-50">Hired</SelectItem>
                        <SelectItem value="rejected" className="hover:bg-gray-50">Rejected</SelectItem>
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
                      <TableHead className="w-[120px] px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {filteredApplications.map((application, index) => (
                      <TableRow key={index}>
                        <TableCell className="p-4 w-[120px]"> {application.jobId.jobType} </TableCell>
                        <TableCell className="p-4 w-[120px]"> {application.jobId.workType} </TableCell>
                        <TableCell className="p-4 font-medium text-slate-900">{application.jobId.companyId.companyName || "N/A"}</TableCell>
                        <TableCell className="p-4 font-semibold text-slate-900">{application.jobId.title}</TableCell>
                        <TableCell className="p-4 w-[180px] text-sm text-slate-600">
                          {application.jobId.companyId.location.City}, {application.jobId.companyId.location.State || application.jobId.companyId.location.Country}
                        </TableCell>
                        <TableCell className="p-4 w-[120px] text-sm text-slate-600">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(application.status)}`}>
                            {application.status}
                          </span>                        
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-slate-50 sticky bottom-0 border-t border-slate-200">
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold text-slate-700">Total Applications</TableCell>
                      <TableCell colSpan={2} className="text-right font-bold text-slate-900 text-lg">{filteredApplications.length}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}