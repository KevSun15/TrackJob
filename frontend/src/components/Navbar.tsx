import { UserCircleIcon } from '@heroicons/react/24/solid';
import { NavLink, useNavigate } from 'react-router-dom'
import { Section, Text, DropdownMenu, Avatar} from '@radix-ui/themes'
import { LayersIcon } from '@radix-ui/react-icons';
import { useSelector,useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { useLogoutMutation } from '../redux/usersApiSlice';
import { logout } from '../redux/authSlice';
import { toast } from 'react-toastify';

export default function Navbar(){

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userLogout, { isLoading }] = useLogoutMutation();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    
    const handleLogout = async() => {
        try {
          await userLogout(undefined).unwrap();
          dispatch(logout());
          navigate('/');
          toast.success("Logged out Successfully");
        } catch (error) {
          toast.error("Something went wrong");
        }
    }

    return(
      <Section size="1" className="bg-white shadow-lg border-b border-gray-100 top-0 z-50">
        <div className="px-16">
          <div className="flex justify-between items-center py-2">
            <div>
              <NavLink to='/' className="flex items-center group">
                <LayersIcon width="50" height="50" 
                  className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"/>
                <Text size="7" weight="bold" className="pl-4 text-gray-800"> 
                  Track <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job</span>
                </Text>
              </NavLink> 
            </div>
            <div>
              { !userInfo ? (
                  <div className="flex items-center gap-4">
                    <NavLink to='/Login' className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-gray-50">
                      Login
                    </NavLink>
                    <NavLink to='/Register' className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 shadow-md">
                      Register
                    </NavLink>
                  </div>) : userInfo.role === 'applicant' ? (
                  <div className="flex items-center gap-4">
                    <NavLink to='/Jobs' className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-blue-50 hover:text-blue-700">
                      Jobs
                    </NavLink>
                    <NavLink to='/Browse' className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 shadow-md">
                      Browse
                    </NavLink>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger> 
                        <div className="flex items-center gap-2 cursor-pointer py-2 px-4 border-2 border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md group">
                          <Avatar src={userInfo?.avatarURL || undefined} fallback={<UserCircleIcon />} radius="full" size="3" color="gray"
                          />
                          <h1 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200"> 
                            {userInfo.firstName.toUpperCase().charAt(0) +"." + userInfo.lastName.toUpperCase().charAt(0)}
                          </h1>
                        </div>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="min-w-[12rem] p-2 rounded-xl shadow-xl bg-white border border-gray-100 mt-2">
                        <DropdownMenu.Item onClick={() => navigate("/Profile")} className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer font-medium text-gray-700"> 
                          View Profile 
                        </DropdownMenu.Item>
                        <DropdownMenu.Item color="red" onClick={handleLogout} className="px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 cursor-pointer font-medium text-red-600 hover:text-red-700"> 
                          Logout 
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>):(
                  <div className="flex items-center gap-4">
                    <NavLink to='/Jobs' className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-blue-50 hover:text-blue-700">
                      Jobs
                    </NavLink>
                    <NavLink to='/Companies' className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 shadow-md">
                      Companies
                    </NavLink>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger> 
                        <div className="flex items-center gap-2 cursor-pointer py-2 px-4 border-2 border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md group">
                          <UserCircleIcon className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"/>
                          <h1 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200"> 
                            {userInfo.firstName} 
                          </h1>
                        </div>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="min-w-[12rem] p-2 rounded-xl shadow-xl bg-white border border-gray-100 mt-2">
                        <DropdownMenu.Item  onClick={() => navigate("/Profile")} className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer font-medium text-gray-700"> 
                          View Profile 
                        </DropdownMenu.Item>
                        <DropdownMenu.Item color="red" onClick={handleLogout}className="px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 cursor-pointer font-medium text-red-600 hover:text-red-700"> 
                          Logout 
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>)}
            </div>
            
          </div>
        </div>
      </Section>
    )
}