import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { MenuOutlined } from "@ant-design/icons";
import useExpand from "../hooks/useExpand";

const links = [
  { label: "About", hash: "about" },
  { label: "Features", hash: "features" },
  { label: "Pricing", hash: "pricing" },
  { label: "Contact us", hash: "contact" },
];

const HomeNavbar = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { ref, expand, setExpand } = useExpand();
  const navigate = useNavigate();

  function renderButton() {
    const label = isAuthenticated ? "Dashboard" : "Login";
    const onClick = () => {
      if (isAuthenticated) return navigate("/dashboard/");
      return loginWithRedirect();
    };

    return (
      <button className="btn-primary" onClick={onClick}>
        {label}
      </button>
    );
  }

  function renderMenuItems() {
    return (
      <>
        {links.map(({ hash, label }) => (
          <li key={hash}>
            <HashLink
              to={`/#${hash}`}
              smooth
              className="pb-3 transition-all border-b-2 hover:text-primary border-b-transparent hover:border-b-primary"
              onClick={() => {
                if (expand) setExpand(false);
              }}
            >
              {label}
            </HashLink>
          </li>
        ))}
        <li>{renderButton()}</li>
      </>
    );
  }

  return (
    <div className="flex items-center w-4/5 m-auto">
      <Link to="/">
        <img src={logo} alt="logo" className="h-11" />
      </Link>

      <div className="relative ml-auto md:hidden" ref={ref}>
        <MenuOutlined
          className="cursor-pointer btn-text"
          onClick={() => setExpand((prev) => !prev)}
        />
        {expand && (
          <ul className="absolute z-10 flex flex-col items-center gap-6 p-5 bg-white right-3 drop-shadow-md">
            {renderMenuItems()}
          </ul>
        )}
      </div>
      <div className="hidden ml-auto md:block">
        <ul className="flex items-center gap-4 ">{renderMenuItems()}</ul>
      </div>
    </div>
  );
};

export default HomeNavbar;
