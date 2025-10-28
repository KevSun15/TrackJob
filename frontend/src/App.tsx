import { Theme } from '@radix-ui/themes';
import { Outlet, createBrowserRouter} from 'react-router-dom';
import Error from './components/auth/Error';
import HomeScreen from './components/HomeScreen';
import Login from './components/Login';
import Register from './components/RegisterUser';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import JobCreate from './components/admin/JobCreate';
import AdminCompanies from './components/admin/AdminCompanies';
import CompanyCreate from './components/admin/CompanyCreate';
import Browse from './components/Browse';
import Jobs from './components/Jobs';
import JobPage from './components/JobPage';
import CompanyJobs from './components/CompanyJobs';
import Companies from './components/Companies';
import Application from './components/admin/Application';
import {AdminCompanyDashboard} from './components/admin/AdminCompanyJobs';


export const router = createBrowserRouter([
  {
    path: "/", 
    element: <App />,
    errorElement: <Error />,    
    children: [
      { index: true, element: <HomeScreen /> },    
      { path: "login", element: <Login /> } ,
      { path: "register", element: <Register /> },
      { path: "companies/:id", element: <CompanyJobs /> }, 
      { path: "profile", element: ( <ProtectedRoute> <Profile /> </ProtectedRoute> )},
      { path: "companies", element: ( <ProtectedRoute> <Companies /> </ProtectedRoute> )},
      { path: "jobs", element: ( <ProtectedRoute> <Jobs /> </ProtectedRoute> )},
      { path: "browse", element: ( <ProtectedRoute> <Browse /> </ProtectedRoute> )},
      { path: "job/:id", element: ( <ProtectedRoute> <JobPage /> </ProtectedRoute> )},
      { path: "admin/jobs", element: ( <ProtectedRoute> <AdminDashboard /> </ProtectedRoute> )},
      { path: "admin/companies", element: ( <ProtectedRoute> <AdminCompanies /> </ProtectedRoute> )},
      { path: "admin/jobs/create", element: ( <ProtectedRoute> <JobCreate /> </ProtectedRoute> )},
      { path: "admin/companies/create", element: ( <ProtectedRoute> <CompanyCreate /> </ProtectedRoute> )},
      { path: "admin/companies/:id/edit", element: ( <ProtectedRoute> <CompanyCreate /> </ProtectedRoute> )},
      { path: "admin/application/:id", element: ( <ProtectedRoute> <Application /> </ProtectedRoute> )},
      { path: "admin/companies/:id", element: ( <ProtectedRoute> <AdminCompanyDashboard /> </ProtectedRoute> )},
    ],
    
  },
]);



function App() {

  return (
    <Theme>
      <Outlet />
    </Theme>
  )
}

