import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import FormsPage from "./pages/FormsPage";
import Dashboardpage from "./pages/Dashboardpage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <div className="flex bg-slate-100">
      <Navbar />
      <main className="relative w-full p-8 m-2 h-[1000rem]">
        <Routes>
          <Route index element={<Dashboardpage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
