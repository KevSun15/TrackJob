import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { MoveLeft, UploadCloud, FileText, X, Briefcase, Clock, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import { setResume } from "@/redux/authSlice";
import { useUploadResumeMutation } from "../redux/apiSlices/usersApiSlice";
import { Avatar } from "@radix-ui/themes"; // Assuming you have this from Radix
import { useCreateApplicationMutation, useGetMyApplicationsMutation } from "../redux/apiSlices/applicationsApiSlice";
import { setApplications } from "../redux/applicationSlice";



export default function JobPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((state: RootState) => state.jobs);
  const [uploadResume] = useUploadResumeMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [createApplication] = useCreateApplicationMutation();
  const { allApplications } = useSelector((state: RootState) => state.applications);
  const [ getMyApplications] = useGetMyApplicationsMutation();

  useEffect(() => {
    const getApplications = async () => {
      try {
        const applications = await getMyApplications(null).unwrap();
        dispatch(setApplications(applications));
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    getApplications();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      try {
        const url = await uploadResume(file).unwrap();
        dispatch(setResume(url.resume));
        toast.success("Resume uploaded successfully");
      } catch {
        toast.error("Resume upload failed");
        setResumeFile(null); 
      }
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your resume to apply.");
      return;
    }
    const applicationData = {
      jobId: singleJob?._id,
      recruiterId: singleJob?.recruiterId,
      resumeUrl: userInfo?.resume,
      message,
    }
    try {
      const application = await createApplication(applicationData).unwrap();
      dispatch(setApplications([...allApplications, application]));
      console.log(application);
      console.log(allApplications)
      navigate('/jobs');
      toast.success("Application submitted!");
    } catch (error) {
      toast.error("Failed to submit application.");
    }
  };
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="pt-5">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <Avatar 
                    // src later 
                    fallback={singleJob?.companyId.companyName?.charAt(0) || "C"}
                    size="5"
                    radius="medium"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-oxford-blue mb-1">{singleJob?.title}</h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                      <span className="font-semibold">{singleJob?.companyId.companyName}</span>
                      <span>•</span>
                      <span>{singleJob?.companyId.location.Country}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
                  <MoveLeft className="w-4 h-4"/>
                  Back
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b">
                <StatItem icon={<Briefcase size={20}/>} label="Work Type" value={singleJob?.workType || "Full-time"} />
                <StatItem icon={<Clock size={20}/>} label="Job Type" value={singleJob?.jobType || "Permanent"} />
                <StatItem icon={<DollarSign size={20}/>} label="Salary" value={singleJob?.salary || "Competitive"} />
                <StatItem icon={<Calendar size={20}/>} label="Posted" value={singleJob?.postedAt ? new Date(singleJob.postedAt).toLocaleDateString() : "Recently"}/>
              </div>
            </div>
            {singleJob?.skills && singleJob.skills.length > 0 && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-oxford-blue mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {singleJob.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-oxford-blue text-white rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-oxford-blue mb-4">Job Description</h2>
              <div className="prose prose-slate max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {singleJob?.description}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-bold text-oxford-blue mb-6 border-b pb-4">Apply for this Position</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume/CV <span className="text-red-500">*</span>
                </label>
                <input type="file" id="resume" name="resume" required onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden"/>
                {!resumeFile ? (
                  <label htmlFor="resume" className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500"><span className="font-semibold text-orange-web">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between w-full p-4 border border-oxford-blue bg-oxford-blue rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-orange-web"/>
                      <span className="text-sm font-medium text-orange-web">{resumeFile.name}</span>
                    </div>
                    <button type="button" onClick={() => setResumeFile(null)} className="text-orange-web cursor-pointer hover:text-orange-web/80 transition">
                      <X size={18}/>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message to recruiter</label>
                <textarea id="message" name="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-web/50 focus:border-orange-web outline-none transition resize-none"
                  placeholder="Tell us why you're a great fit for this position..."/>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-orange-web text-oxford-blue font-bold py-4 px-6 rounded-lg hover:bg-orange-web/90 cursor-pointer transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-web/50">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <p className="font-semibold text-oxford-blue text-base">{value}</p>
  </div>
);