import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { useAuth0 } from "@auth0/auth0-react";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  if (!(isLoading || isAuthenticated)) navigate("/");

  return (
    <>
      <DashboardNavbar />
      <main className="relative w-full p-8 m-2">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
