import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { setSearchQuery } from '../redux/jobSlice'; // Assuming this path is correct
import { BriefcaseIcon, MapPinIcon,ChevronDownIcon, SparklesIcon, UserPlusIcon, CheckBadgeIcon, ArrowTrendingUpIcon, UserGroupIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';


function HeroSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    const handleSearch = () => {
        if (search || location) {
            const combinedQuery = `${search} ${location}`.trim();
            dispatch(setSearchQuery(combinedQuery));
            navigate('/browse');
        }
    };

    return (
        <section className="relative flex items-center justify-center bg-gradient-to-br from-platinum via-white to-platinum overflow-hidden" style={{ minHeight: 'calc(100vh - 5rem)' }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-web/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-oxford-blue/5 rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto px-6 text-center z-10 max-w-6xl fade-in-up">
              <h1 className="text-5xl md:text-7xl text-oxford-blue font-extold leading-tight mb-6">
                Find Your Dream Job
                <br />
                <span className="text-orange-web">Start Your Journey</span>
              </h1>
              <p className="text-lg md:text-xl text-oxford-blue/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connecting ambitious talent with innovative companies. Search thousands of opportunities and take the next step in your career.
              </p>
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-3 border border-platinum">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <BriefcaseIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oxford-blue/40" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full py-4 pl-12 pr-4 bg-platinum/30 text-oxford-blue border border-transparent placeholder-oxford-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-web focus:border-transparent transition-all"
                      placeholder='Job title, keyword, or company' />
                  </div>
                  <div className="relative w-full">
                    <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oxford-blue/40" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                      onSubmit={() => handleSearch()} className="w-full py-4 pl-12 pr-4 bg-platinum/30 text-oxford-blue border border-transparent placeholder-oxford-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-web focus:border-transparent transition-all"
                      placeholder='Location or "Remote"' />
                  </div>
                  <button onClick={handleSearch} className="w-full md:w-auto px-10 py-4 bg-orange-web text-oxford-blue rounded-xl font-bold transition-all duration-200 hover:shadow-xl hover:brightness-110 flex items-center justify-center shrink-0 shadow-lg">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>
            <button
                onClick={() => {
                    document.querySelector('#why-us-section')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                }}
                className="absolute cursor-pointer bottom-8 left-1/2 -translate-x-1/2 z-20 p-2 rounded-full"
                aria-label="Scroll to next section">
                <ChevronDownIcon className="h-8 w-8 text-oxford-blue animate-bounce" />
            </button>
        </section>
    );
}

function WhyUsSection() {
    const features = [
        { icon: SparklesIcon, title: "Find Top Applicants", description: "Connect with the best talent in the industry." },
        { icon: BuildingLibraryIcon, title: "Access Top Companies", description: "Get discovered by industry leaders and innovative startups." },
        { icon: ArrowTrendingUpIcon, title: "Career Growth Tools", description: "Track your applications, get resume tips, and monitor market trends." },
        { icon: UserGroupIcon, title: "Community & Support", description: "Join a network of professionals and get support on your journey." }
    ];

    return (
        <section id="why-us-section" className="py-39 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="lg:pr-12">
                  <span className="text-orange-web font-bold uppercase tracking-wider">Why Choose Us?</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-oxford-blue mb-6 mt-2">
                    Everything You Need in One Platform
                  </h2>
                  <p className="text-lg text-oxford-blue/70 mb-8 leading-relaxed">
                    TrackJob is more than just a job board. We provide the tools, insights, and connections to help you build a successful career. From smart matching to real-time tracking, we're with you every step of the way.
                  </p>
                  <button className="px-8 py-4 cursor-pointer bg-oxford-blue text-white rounded-xl font-bold transition-all duration-200 hover:shadow-xl hover:bg-oxford-blue/90 shadow-lg">
                    Get Started Now
                  </button>
                </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="group p-6 rounded-2xl bg-white border border-platinum transition-all duration-300 hover:shadow-xl hover:border-orange-web/30">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-web/10 to-orange-web/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <feature.icon className="h-7 w-7 text-orange-web" />
                        </div>
                        <h3 className="text-xl font-bold text-oxford-blue mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-oxford-blue/70 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>
          </div>
        </section>
    );
}

function HowItWorksSection() {
    const steps = [
        { number: "01", icon: UserPlusIcon, title: "Create Your Profile", description: "Sign up and build your professional profile. Add your resume, skills, and experience to stand out."},
        { number: "02", icon: MagnifyingGlassIcon, title: "Find & Apply for Jobs",description: "Use our powerful search and AI matching to find the perfect jobs. Apply with a few simple clicks."},
        { number: "03", icon: CheckBadgeIcon, title: "Track & Get Hired", description: "Monitor your application status in real-time and connect directly with hiring managers."},
    ];

    return (
        <section id="process-section" className="py-26 bg-oxford-blue">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="text-5xl text-white font-bold text-center mb-7">
              Get Started in 3 Easy Steps
            </h1>
            <p className="text-gray-300 text-center mb-10">
              Your next career move is just a few clicks away. Follow our simple process to get started.
            </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-oxford-blue/10" style={{ transform: 'translateY(-2.5rem)', zIndex: 0 }}></div>
                {steps.map((step, index) => (
                  <div key={index} className="p-8 rounded-2xl bg-white shadow-lg border border-platinum text-center relative z-10">
                    <div className="relative flex justify-center mb-20">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-web to-orange-web/80 flex items-center justify-center shadow-lg">
                        <step.icon className="h-12 w-12 text-oxford-blue" />
                      </div>
                      <span className="absolute -top-4 -right-2 text-6xl font-extrabold text-oxford-blue/10">
                          {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-oxford-blue mb-3">
                      {step.title}
                    </h3>
                    <p className="text-oxford-blue/70 leading-relaxed mb-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
          </div>
        </section>
    );
}

export default function Hero() {
    return (
        <div className="scroll-smooth">
          <HeroSection />
          <WhyUsSection />
          <HowItWorksSection />
        </div>
    );
}
