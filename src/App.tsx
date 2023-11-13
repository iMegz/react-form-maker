import { Route, Routes } from "react-router-dom";
import "./App.css";
import FormsPage from "./pages/FormsPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import EditFormPage from "./pages/EditFormPage";
import FormPage from "./pages/FormPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";
import ResponseSentPage from "./pages/ResponseSentPage";
import ResponsesPage from "./pages/ResponsesPage";
import ResponsePage from "./pages/ResponsePage";

function App() {
  const { isLoading } = useAuth0();

  function renderRoutes() {
    if (isLoading) return <Route path="*" element={<LoadingPage />} />;
    return (
      <>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="forms">
            <Route index element={<FormsPage />} />
            <Route path="edit/:id?" element={<EditFormPage />} />
            <Route path="preview/:id?" element={<FormPage preview />} />
            <Route path="responses/:id" element={<ResponsesPage />} />
            <Route path="response/:id" element={<ResponsePage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </>
    );
  }

  return (
    <div className="flex bg-slate-100 max-h-max">
      <Routes>
        {renderRoutes()}
        <Route path="form/:id" element={<FormPage />} />
        <Route path="response/sent" element={<ResponseSentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
