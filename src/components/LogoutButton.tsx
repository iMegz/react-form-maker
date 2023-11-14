import { LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="btn-text-danger"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <span className="md:hidden">
        <LogoutOutlined className="rotate-180" />
      </span>
      <span className="hidden md:inline">Log Out</span>
    </button>
  );
};

export default LogoutButton;
