import { Route, Routes } from "react-router-dom";
import "./App.css";
import FormsPage from "./pages/FormsPage";
import Dashboardpage from "./pages/Dashboardpage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import EditFormPage from "./pages/EditFormPage";
import FormPage from "./pages/FormPage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <div className="flex bg-slate-100 max-h-max">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboardpage />} />
          <Route path="forms">
            <Route index element={<FormsPage />} />
            <Route path="edit/:id?" element={<EditFormPage />} />
            <Route path="preview/:id?" element={<FormPage preview />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="form/:id" element={<FormPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
