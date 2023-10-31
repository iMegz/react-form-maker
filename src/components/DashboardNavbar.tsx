import {
  DashboardOutlined,
  FormOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import LogoutButton from "./LogoutButton";

const links = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Forms", path: "/forms", icon: <FormOutlined /> },
  { label: "Settings", path: "/settings", icon: <SettingOutlined /> },
];

const NavbarLink = ({ icon, label, path }: (typeof links)[0]) => {
  return (
    <li>
      <NavLink
        title={label}
        to={path}
        className={({ isActive }) => {
          const active = isActive
            ? "bg-primary hover:bg-primary text-white"
            : "hover:bg-gray-200";
          return (
            "flex items-center gap-2 px-6 py-4 rounded-lg w-full text-xl md:text-base " +
            active
          );
        }}
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </NavLink>
    </li>
  );
};

const DashboardNavbar = () => {
  return (
    <nav className="flex flex-col items-center min-h-screen bg-white drop-shadow-md">
      <div className="w-20 px-1 pt-5 mb-4 md:p-5 md:w-full">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-full" />
        </Link>
      </div>
      <ul className="flex flex-col items-stretch gap-2 px-3 py-2">
        {links.map((link) => (
          <NavbarLink key={link.path} {...link} />
        ))}
        <hr />
        <li className="flex justify-center">
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;
