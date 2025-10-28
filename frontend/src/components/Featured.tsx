import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../redux/store'; 
import { useDispatch, useSelector } from 'react-redux';
import { BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Autoplay from "embla-carousel-autoplay"
import { useGetAllJobsMutation } from '../redux/apiSlices/jobsApiSlice';
import { setAllJobs } from '../redux/jobSlice';
import { type Job } from "../redux/jobSlice";
import { Avatar } from '@radix-ui/themes';
import { useGetAllCompaniesMutation } from '../redux/apiSlices/companyApiSlice';
import { setAllCompanies } from '../redux/companySlice';
import { type Company } from '../redux/companySlice';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function Featured(){
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [getAllJobs] = useGetAllJobsMutation();
    const [getAllCompanies] = useGetAllCompaniesMutation();
    const [featuredCompanies, setCompanies] = useState<Company[]>([]);
    const { allJobs } = useSelector((state: RootState) => state.jobs);
    const [latestJobs, setJobs] = useState<Job[]>([]);

useEffect(() => {
    const fetchJobsAndCompanies = async () => {
        try {
             const jobs = await getAllJobs(null).unwrap();
            const companies = await getAllCompanies(null).unwrap();
            dispatch(setAllCompanies(companies));
            dispatch(setAllJobs(jobs));
            setCompanies(companies);
        } catch (error) {
            console.error('Failed to fetch jobs and companies:', error);
        }
    };

    fetchJobsAndCompanies();
  }, [dispatch, getAllJobs, getAllCompanies]);

useEffect(() => {
    if (!allJobs) return;
    if (allJobs.length < 3) {
        setJobs(allJobs);
    } else {
        setJobs(allJobs.slice(0, 3));
    }
}, [allJobs, setJobs]);

    return (
        <section id="featured-companies" className="py-30 bg-platinum w-full">
          <div className="container mx-auto px-4 flex flex-col items-center mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Featured Companies
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                Explore opportunities from top companies that are actively hiring new talent.
              </p>
            </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-6xl bg-oxford-blue rounded-xl p-4" >
                  <CarouselContent>
                    {featuredCompanies.map((company) => (
                      <CarouselItem key={company._id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-2">
                          <Card className="overflow-hidden bg-white">
                            <CardContent className="flex flex-col p-6 min-h-[240px]">
                              <div className="flex items-center mb-4">
                                <Avatar src={company.logoUrl} size="6" fallback={`${company.companyName.charAt(0).toUpperCase()}`} className="mr-4"/> 
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {company.companyName}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                    <span>{company.location.City}, {company.location.State} {company.location.Country}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {company.description.length > 100 ? `${company.description.substring(0, 100)}...` : company.description}
                                </p>  
                              </div>

                                <div className="flex items-center text-sm text-gray-500 mt-1 bg-blue-100 p-2 rounded-lg w-max">
                                  <BriefcaseIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                  <span>{allJobs.filter(job => job.companyId._id === company._id).length} Job{allJobs.filter(job => job.companyId._id === company._id).length !== 1 ? 's' : ''}</span>
                                </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <button onClick={() => navigate('/companies')} className="mt-10 px-8 cursor-pointer py-4 bg-orange-web text-oxford-blue rounded-xl font-bold transition-all duration-200 hover:shadow-xl hover:brightness-110 shadow-lg">
                  View All Companies  
              </button>
          </div>
          <div className="container mx-auto px-4 flex flex-col items-center">
              <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                      Featured Jobs
                  </h2>
                  <p className="mt-4 text-lg text-gray-600 max-w-3xl">
                      Discover the latest job openings from top companies looking for talented individuals like you.
                  </p>
              </div>
              <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({ delay: 2000, stopOnInteraction: false })
                  ]}
                  className="w-full max-w-5xl bg-oxford-blue rounded-xl p-4" >
                  <CarouselContent>
                    {latestJobs.map((job) => (
                      <CarouselItem key={job._id} className="">
                        <div className="p-2">
                          <Card className="overflow-hidden">
                            <CardContent className="flex flex-col p-6 min-h-[240px] bg-white">
                              <div className="flex-grow">
                                <div className="flex items-start gap-4">
                                  <Avatar src={job.companyId.logoUrl} size="6" fallback={`${job.companyId.companyName.charAt(0).toUpperCase()}`} className="mb-4"/>
                                  <div>
                                    <h3 className="text-xl font-bold text-oxford-blue group-hover:text-orange-web transition-colors">
                                      {job.title}
                                    </h3>
                                    <p className="text-md font-semibold text-oxford-blue/90 mt-1">{job.company}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-oxford-blue/70 mt-3">
                                      <p className="flex items-center gap-1.5"><MapPinIcon className="h-4 w-4" /> {job.companyId.location.City}, {job.companyId.location.State} {job.companyId.location.Country}</p>
                                      <p className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4" /> {job.jobType}</p>
                                      <p className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4" /> {job.workType}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <p className="text-sm font-semibold text-oxford-blue/70 mt-1"> Salary: {job.salary}</p>
                                      <p className="text-sm font-semibold text-oxford-blue/70 mt-1"> Posted At: {new Date(job.postedAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6 text-oxford-blue/70 text-sm leading-relaxed">
                                  <p> {job.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
              </Carousel>
              <button onClick={() => navigate('/browse')} className="mt-10 cursor-pointer px-8 py-4 bg-orange-web text-oxford-blue rounded-xl font-bold transition-all duration-200 hover:shadow-xl hover:brightness-110 shadow-lg">
                View All Companies  
              </button>
          </div>
        </section>
    );
}