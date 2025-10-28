import Navbar from "../Navbar";
import { Briefcase, User, MapPin, DollarSign, Building, FileText, MessageSquare, Info, GraduationCap, MoveLeft, Check } from "lucide-react";
import { type RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { useNavigate } from "react-router-dom";
import { useUpdateApplicationMutation } from "@/redux/apiSlices/applicationsApiSlice";

export default function Application() {
  const { singleApplication } = useSelector((state: RootState) => state.applications);
  const [updateApplication] = useUpdateApplicationMutation();
  const navigate = useNavigate();

  const updateStatus = async (status: string) => {
    try {
      await updateApplication({ id: singleApplication?._id, status });
      navigate(-1);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-slate-800">{singleApplication?.jobId.title}</h1>
              <div className="flex flex-col">
                <button className="flex items-center justify-center gap-2 hover:text-underline cursor-pointer" onClick={() => navigate(-1)}> <MoveLeft size={16}/> Back </button>
                <div className="flex mt-2 gap-2">
                  <button onClick={() => updateStatus('Hired')} className="flex cursor-pointer p-2 items-center hover:bg-green-800 rounded-sm hover:text-white text-green-800 border border-green-500"> <Check size={16} /> Approve  </button>
                  <button onClick={() => updateStatus('Rejected')} className="rounded-sm cursor-pointer p-2 hover:bg-red-800 hover:text-white text-red-800 border border-red-500"> Reject </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600 mt-2">
              <Building size={16} />
              <span className="font-semibold">{singleApplication?.jobId.companyId.companyName}</span>
              <span className="text-slate-400">·</span>
              <MapPin size={16} />
              <span>{singleApplication?.jobId.companyId.location.City}, {singleApplication?.jobId.companyId.location.State ? `${singleApplication?.jobId.companyId.location.State}, ` : ''}{singleApplication?.jobId.companyId.location.Country}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Briefcase size={16} className="text-sky-600"/>
                <div>
                  <p className="font-semibold">Job Type</p>
                  <p className="text-slate-500">{singleApplication?.jobId.jobType} ({singleApplication?.jobId.workType})</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <DollarSign size={16} className="text-green-600"/>
                <div>
                  <p className="font-semibold">Salary</p>
                  <p className="text-slate-500">${singleApplication?.jobId.salary.toLocaleString()}/yr</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-800">Job Description</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">{singleApplication?.jobId.description}</p>
            </div>
          </div>
          <div className="p-8 bg-slate-50/90">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <User size={24}/>
              Applicant Details
            </h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">Full Name</p>
                <p className="text-lg text-slate-700">{singleApplication?.applicantId.firstName} {singleApplication?.applicantId.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Email Address</p>
                <p className="text-lg text-slate-700">{singleApplication?.applicantId.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Resume</p>
                <a href={singleApplication?.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-sky-600 hover:underline flex items-center gap-2">
                  <FileText size={18}/>
                  <span>View Resume</span>
                </a>
              </div>
              {( singleApplication?.applicantId.profile.githubUrl || singleApplication?.applicantId.profile.linkedinUrl) && (
              <div>
                <p className="text-sm font-semibold text-slate-500">Other Links</p>
                <div className="flex items-center gap-4 mt-1">
                  { singleApplication?.applicantId.profile?.githubUrl &&
                    <a href={singleApplication?.applicantId.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline flex items-center gap-1.5">
                      <GitHubLogoIcon width={14} height={14}/>
                      <span>GitHub</span>
                    </a>
                  }
                  { singleApplication?.applicantId.profile?.linkedinUrl && 
                    <a href={singleApplication?.applicantId.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline flex items-center gap-1.5">
                      <LinkedInLogoIcon width={14} height={14}/>
                      <span>LinkedIn</span>
                    </a>
                  }
                </div>
              </div>)}
              {
                singleApplication?.applicantId.education && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4">
                        <GraduationCap size={22}/>
                        Education
                    </h3>
                    <div className="space-y-4">
                      <div key={singleApplication?.applicantId.education.institution} className="pl-2">
                        <p className="font-semibold text-slate-700">{singleApplication?.applicantId.education.institution}</p>
                        <p className="text-slate-600">{singleApplication?.applicantId.education.degree} in {singleApplication?.applicantId.education.field}</p>
                        <p className="text-sm text-slate-500">
                          {format(new Date(singleApplication?.applicantId.education.startDate), 'MMM dd, yyyy')} – {format(new Date(singleApplication?.applicantId.education.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-3">
                <Info size={22}/>
                Bio
              </h3>
              { singleApplication?.applicantId.profile.bio && 
                <p className="text-slate-600 leading-relaxed">
                  {singleApplication?.applicantId.profile.bio}
              </p> 
              }
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <MessageSquare size={16}/>
                Message
              </p>
              <p className="text-slate-700 mt-2 bg-white border border-slate-200 p-4 rounded-lg italic">
                "{singleApplication?.message}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}