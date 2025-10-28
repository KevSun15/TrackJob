import { UserCircleIcon } from '@heroicons/react/24/solid';
import { NavLink, useNavigate } from 'react-router-dom'
import { Section, DropdownMenu, Avatar} from '@radix-ui/themes'
import { LayersIcon,ExitIcon } from '@radix-ui/react-icons';
import { useSelector,useDispatch } from 'react-redux';
import { type RootState } from '../redux/store';
import { useLogoutMutation } from '../redux/apiSlices/usersApiSlice';
import { logout } from '../redux/authSlice';
import { toast } from 'sonner';

export default function Navbar(){

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userLogout] = useLogoutMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userInitials = userInfo 
    ? `${userInfo.firstName.toUpperCase().charAt(0)}.${userInfo.lastName.toUpperCase().charAt(0)}` 
    : '';
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
    <Section size="1" className="bg-oxford-blue border-b border-platinum/10 top-0 z-50">
      <div className="px-16 py-1">
        <div className="flex justify-between items-center">
          <div>
            <NavLink to='/' className="flex items-center group">
              <LayersIcon width="46" height="46" className="p-2.5 rounded-xl shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg bg-orange-web text-oxford-blue"/>
                <div className="ml-3">
                  <h1 className="text-white text-3xl font-bold tracking-tight">
                    Track<span className="text-orange-web">Job</span>
                  </h1>
                </div>
            </NavLink> 
          </div>
          <div>
            {!userInfo ? (
              <div className="flex items-center gap-3">
                <NavLink to='/login' className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-white/90 text-oxford-blue bg-white">
                  Login
                </NavLink>
                <NavLink to='/register' className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg shadow-md hover:brightness-105 text-oxford-blue bg-orange-web">
                  Register
                </NavLink>
              </div>) : userInfo.role === 'applicant' ? (
              <div className="flex items-center gap-3">
                <NavLink to='/jobs' className="px-5 py-2.5 cursor-pointer rounded-lg font-medium text-white bg-transparent transition-all duration-200 hover:bg-orange-web/10 border-2 border-orange-web">
                  Jobs
                </NavLink>
                <NavLink to='/companies' className="px-5 py-2.5 cursor-pointer rounded-lg font-medium text-white bg-transparent transition-all duration-200 hover:bg-orange-web/10 border-2 border-orange-web">
                  Companies
                </NavLink>
                <NavLink to='/browse' className="px-5 py-3 mr-2 cursor-pointer rounded-lg font-medium transition-all duration-200 hover:shadow-lg shadow-md hover:brightness-105 text-oxford-blue bg-orange-web">
                  Browse
                </NavLink>
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger>
                    <button className="flex items-center gap-2 cursor-pointer py-2 px-3.5 rounded-full hover:bg-orange-web/20 group border border-orange-web focus:outline-none">
                      <Avatar src={userInfo?.avatarURL || undefined} fallback={<UserCircleIcon />} radius="full" size="2" className="bg-white" color="gray" />
                      <h1 className="font-semibold text-orange-web text-sm">{userInitials}</h1>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="rounded-xl shadow-xl bg-white mt-1 border border-platinum">
                    <DropdownMenu.Item color="gray" onClick={() => navigate("/Profile")} className="px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 font-medium text-oxford-blue"> 
                      View Profile 
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color="red" onClick={handleLogout} className="px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 font-medium"> 
                      Logout <ExitIcon />
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>):(
              <div className="flex items-center gap-3"> 
                <NavLink to='/admin/jobs' className="px-5 py-2.5 cursor-pointer rounded-lg font-medium text-white bg-transparent transition-all duration-200 hover:bg-orange-web/10 border-2 border-orange-web">
                  Jobs
                </NavLink>
                <NavLink to='/admin/companies' className="px-5 py-2.5 mr-2 cursor-pointer rounded-lg font-medium transition-all duration-200 hover:shadow-lg shadow-md hover:brightness-105 text-oxford-blue bg-orange-web">
                  Companies
                </NavLink>
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger>
                    <button className="flex items-center gap-2 cursor-pointer py-2 px-3.5 rounded-full hover:bg-orange-web/20 group border border-orange-web focus:outline-none">
                      <Avatar src={userInfo?.avatarURL || undefined} fallback={<UserCircleIcon />} radius="full" size="2" className="bg-white" color="gray"/>
                      <h1 className="font-semibold text-orange-web text-sm">{userInitials}</h1>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="rounded-xl shadow-xl bg-white mt-1 border border-platinum">
                    <DropdownMenu.Item color="gray" onClick={() => navigate("/Profile")} className="px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 font-medium text-oxford-blue"> 
                      View Profile 
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color="red" onClick={handleLogout} className="px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 font-medium"> 
                      Logout <ExitIcon />
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