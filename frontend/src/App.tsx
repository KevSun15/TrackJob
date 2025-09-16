import { Theme } from '@radix-ui/themes';
import { Outlet, createBrowserRouter} from 'react-router-dom';
import Error from './auth/Error';
import HomeScreen from './components/HomeScreen';
import Login from './components/Login';
import Register from './components/RegisterUser';
import ProtectedRoute from './auth/ProtectedRoute';
import Profile from './components/Profile';

export const router = createBrowserRouter([
  {
    path: "/", 
    element: <App />,
    errorElement: <Error />,    
    children: [
      { path: "/", element: <HomeScreen /> },    
      { path: "Login", element: <Login /> } ,
      { path: "Register", element: <Register /> },
      { path: "Profile", element: ( <ProtectedRoute> <Profile /></ProtectedRoute> )},
      { path: ":id/dashboard", element: ( <ProtectedRoute> <Profile /> </ProtectedRoute> )},
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

