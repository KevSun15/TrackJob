import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Briefcase, Search } from "lucide-react";
import { Avatar } from "@radix-ui/themes"; // Assuming @radix-ui/themes is installed
import { setAllCompanies, setSingleCompany } from "../redux/companySlice";
import { useGetAllCompaniesMutation } from "../redux/apiSlices/companyApiSlice";
import type { RootState } from "../redux/store";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'; // For search bar

// Mock data to use since Redux/API is commented out for preview
const mockCompanies = [
    { _id: '1', companyName: 'TechCorp', location: { City: 'San Francisco', State: 'CA' }, description: 'A leading innovator in cloud computing and AI solutions, driving the next wave of technology and digital transformation.', logoUrl: 'https://placehold.co/100x100/1e3a8a/ffffff?text=T' },
    { _id: '2', companyName: 'InnovateLabs', location: { City: 'New York', State: 'NY' }, description: 'We are a dynamic startup focused on sustainable energy and green technology. Our mission is to power the future.', logoUrl: 'https://placehold.co/100x100/f97316/ffffff?text=I' },
    { _id: '3', companyName: 'DataDynamics', location: { City: 'Austin', State: 'TX' }, description: 'Unlocking the power of data. We provide cutting-edge analytics and business intelligence platforms for enterprises.', logoUrl: 'https://placehold.co/100x100/1e3a8a/ffffff?text=D' },
    { _id: '4', companyName: 'CloudNine', location: { City: 'Remote', State: '' }, description: 'A fully remote company building next-generation tools for distributed teams. Join us from anywhere.', logoUrl: 'https://placehold.co/100x100/f97316/ffffff?text=C' },
    { _id: '5', companyName: 'GreenLeaf Organics', location: { City: 'Boulder', State: 'CO' }, description: 'Dedicated to providing high-quality organic products while promoting sustainable farming practices.', logoUrl: 'https://placehold.co/100x100/1e3a8a/ffffff?text=G' },
]


export default function Companies() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [companies, setCompanies] = useState<typeof mockCompanies>([]);
    const { allCompanies } = useSelector((state: RootState) => state.companies);
    const [getAllCompanies, { isLoading }] = useGetAllCompaniesMutation();

     useEffect(() => {
       const fetchCompanies = async () => {
         try {
           const companies = await getAllCompanies(null).unwrap();
           dispatch(setAllCompanies(companies));
         } catch (error) { console.error('Failed to fetch companies:', error); }
       };
       fetchCompanies();
    }, [dispatch, getAllCompanies]);
    

    const handleSearch = () => {
        const companies = allCompanies.filter(company =>
            company.companyName.toLowerCase().includes(companyName.toLowerCase()) &&
            (location === '' || company.location.City.toLowerCase().includes(location.toLowerCase()) || company.location.State.toLowerCase().includes(location.toLowerCase()))
        );

        setCompanies(companies);
        console.log("Search button clicked");
    }

    return (
        <div className="min-h-screen bg-platinum">
            <Navbar />
            <main className="container mx-auto px-4 py-10 max-w-5xl">
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-oxford-blue">Explore Companies</h1>
                    <p className="text-lg text-oxford-blue/70 mt-3 max-w-2xl mx-auto">
                        Discover innovative companies, read reviews, and find your next opportunity.
                    </p>
                </header>
                <div className="mb-8 p-3 bg-white rounded-2xl shadow-md border border-platinum">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oxford-blue/40" />
                            <input type="text"
                                className="w-full py-3.5 pl-12 pr-4 bg-platinum/30 text-oxford-blue border border-transparent placeholder-oxford-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-web focus:border-transparent transition-all"
                                placeholder='Company name or keyword' />
                        </div>
                        <div className="relative w-full">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oxford-blue/40" />
                            <input type="text"
                                className="w-full py-3.5 pl-12 pr-4 bg-platinum/30 text-oxford-blue border border-transparent placeholder-oxford-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-web focus:border-transparent transition-all"
                                placeholder='Location (e.g., "Remote" or "New York")' />
                        </div>
                        <button className="w-full md:w-auto px-8 py-3.5 bg-orange-web text-oxford-blue rounded-xl font-bold transition-all duration-200 hover:shadow-lg hover:brightness-110 flex items-center justify-center shrink-0" onClick={() => handleSearch()}>
                            Search
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-oxford-blue/70">Loading companies...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {allCompanies.map((company) => (
                            <div
                                key={company._id}
                                onClick={() => {
                                    navigate(`/companies/${company._id}`);
                                    dispatch(setSingleCompany(company));
                                    console.log("Navigating to company:", company.companyName);
                                }}
                                className="bg-white rounded-2xl shadow-md border border-platinum p-6 flex flex-col sm:flex-row items-start gap-6 group hover:shadow-xl hover:border-orange-web/50 transition-all duration-300 cursor-pointer">
                                <div className="flex-shrink-0">
                                    <Avatar src={company.logoUrl} size="6" fallback={`${company.companyName.charAt(0).toUpperCase()}`} />                                   
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold text-oxford-blue transition-colors">
                                        {company.companyName}
                                    </h2>
                                    <p className="flex items-center gap-1.5 text-md text-oxford-blue/70 mt-1">
                                        <MapPin size={16} /> {company.location.City}{company.location.State ? `, ${company.location.State}` : ''}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                                        {company.description.substring(0, 120)}{company.description.length > 120 ? '...' : ''}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 mt-4 sm:mt-0 sm:self-center">
                                    <span className="text-orange-web font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        View Details <ArrowRight size={18} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

