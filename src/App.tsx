import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import FormsPage from "./pages/FormsPage";
import Dashboardpage from "./pages/Dashboardpage";
import SettingsPage from "./pages/SettingsPage";
import NewFormPage from "./pages/NewFormPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex bg-slate-100">
      <Navbar />
      <main className="relative w-full p-8 m-2">
        <Routes>
          <Route index element={<Dashboardpage />} />
          <Route path="forms">
            <Route index element={<FormsPage />} />
            <Route path="new" element={<NewFormPage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
