import { Route, Routes } from "react-router-dom";
import "./App.css";
import FormsPage from "./pages/FormsPage";
import Dashboardpage from "./pages/Dashboardpage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import EditFormPage from "./pages/EditFormPage";
import FormPage from "./pages/FormPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  function setRoutes() {
    if (isLoading) return <Route path="*" element={<LoadingPage />} />;
    if (!isAuthenticated) return <Route path="/" element={<HomePage />} />;
    return (
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboardpage />} />
        <Route path="forms">
          <Route index element={<FormsPage />} />
          <Route path="edit/:id?" element={<EditFormPage />} />
          <Route path="preview/:id?" element={<FormPage preview />} />
        </Route>
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    );
  }

  return (
    <div className="flex bg-slate-100 max-h-max">
      <Routes>
        {setRoutes()}
        <Route path="form/:id" element={<FormPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
