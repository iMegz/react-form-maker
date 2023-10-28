import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dashboardpage from "../pages/Dashboardpage";
import FormPage from "../pages/FormPage";
import FormsPage from "../pages/FormsPage";
import EditFormPage from "../pages/EditFormPage";
import SettingsPage from "../pages/SettingsPage";
import NotFound from "../pages/NotFound";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <main className="relative w-full p-8 m-2">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
