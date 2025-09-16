import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Section, Container, Box } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { BuildingOffice2Icon, BriefcaseIcon, UserIcon } from '@heroicons/react/24/solid';


export default function Hero(){

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: RootState) => state.auth);


    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter'){
        handleSearch();
      }
    }

    const handleSearch = () => {
      try{
        if (!userInfo){
          navigate("/Login")
        }
        else {
        navigate(`/${encodeURIComponent(searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1))}`)
        }
      } 
      catch (error) {
        
      }
    }


    return(
      <section className="relative h-[40rem] rounded-lg overflow-hidden bg-gray-100 flex-grow">
        <div className="absolute right-5 top-20 w-54 h-52 bg-gradient-to-br from-blue-500/30 to-indigo-400/15 rounded-full blur-lg -translate-y-10 float-animation"></div>
        <div className="absolute top-30 right-50 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-blue-400/12 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-100 left-160 w-100 h-100 bg-gradient-to-br from-blue-500/30 to-indigo-400/15 rounded-full blur-xl float-animation"></div>
        <div className="absolute top-40 left-15 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-indigo-400/15 rounded-full blur-xl float-animation"></div>

        <Section size="2" className="relative z-10 fade-in-up">
          <Container size="2">
            <Box py="9"> 
              <h1 className="text-center font-sans font-bold text-5xl pb-5"> Find Your Next Opportunity. Hire Top Talent. </h1>
              <h1 className="text-center font-sans text-gray-500 font-bold text-xl"> Connecting ambitious job seekers with employers who are hiring right now </h1>
            </Box>
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200" 
                  placeholder='Search "Jobs", "Companies", "Profile"'/> 
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200" 
                  placeholder='Location or "Remote"'/> 
                <button onClick={handleSearch} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center font-medium">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div> 
          </Container>
        </Section>
      </section>
    )
}