import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { type ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};


const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth)

  if (!userInfo) {
    return <Navigate to="/Login" replace />;
  }

  return children;

}

export default ProtectedRoute;