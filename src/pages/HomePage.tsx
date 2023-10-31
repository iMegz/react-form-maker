import HomeNavbar from "../components/HomeNavbar";
import hero from "../assets/heroImg.svg";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <main className="w-full min-h-screen">
      <nav className="p-5 bg-white drop-shadow-md">
        <HomeNavbar />
      </nav>
      <div className="flex items-center px-5 justify-center gap-8 w-full min-h-[calc(100vh-84px)] bg-blue-100 ">
        <div className="flex flex-col items-center max-w-lg text-center lg:items-start lg:text-left">
          <h1 className="mb-2 text-5xl uppercase">Forms Chief</h1>
          <h2 className="text-2xl uppercase ">
            Craft, Collect, and Analyze with Confidence
          </h2>

          <hr className="w-24 my-4 border-gray-400 lg:w-14" />

          <h3 className="text-lg text-gray-400">
            Unlock the hidden potential within your data through our refined
            form creation and analysis tools
          </h3>
          <button
            className="mt-4 btn-primary w-fit"
            onClick={() => loginWithRedirect()}
          >
            Start cooking
          </button>
        </div>
        <img src={hero} alt="Hero image" className="hidden w-1/2 lg:block" />
      </div>
    </main>
  );
};

export default HomePage;
