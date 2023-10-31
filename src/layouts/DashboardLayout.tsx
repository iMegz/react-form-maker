import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardLayout = () => {
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
