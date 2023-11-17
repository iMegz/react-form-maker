import { Navigate, Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { useAuth0 } from "@auth0/auth0-react";

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <>
      <DashboardNavbar />
      <main className="relative w-full p-4 md:m-2 md:p-8">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
