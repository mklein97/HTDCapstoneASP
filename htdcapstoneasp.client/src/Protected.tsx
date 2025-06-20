import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const token = localStorage.getItem("jwtToken");

  //If token exists, render the children routes else redirect to login.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected;