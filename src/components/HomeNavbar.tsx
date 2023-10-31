import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";

const links = [
  { label: "About", hash: "about" },
  { label: "Features", hash: "features" },
  { label: "Contact us", hash: "contact" },
];

const HomeNavbar = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex items-center w-4/5 m-auto">
      <Link to="/">
        <img src={logo} alt="logo" className="h-11" />
      </Link>
      <ul className="flex items-center gap-4 ml-auto">
        {links.map(({ hash, label }) => (
          <li key={hash}>
            <HashLink to={`/#${hash}`} smooth>
              {label}
            </HashLink>
          </li>
        ))}
        <li>
          <button className="btn-primary" onClick={() => loginWithRedirect()}>
            Login
          </button>
        </li>
      </ul>
    </div>
  );
};

export default HomeNavbar;
