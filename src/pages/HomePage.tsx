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

      {/* About */}
      <section className="bg-white " id="about">
        <div className="container text-center">
          <h2 className="text-5xl">
            What is
            <span className="font-semibold text-primary"> Forms Chief </span>?
          </h2>
          <hr className="w-32 border-primary" />
          <div className="flex flex-col w-full gap-3 text-lg text-gray-500 lg:w-3/4">
            <p>
              Forms Chief is your all-in-one platform for creating, managing,
              and analyzing forms and surveys. We're here to simplify your data
              collection process and empower you with insightful analysis.
            </p>
            <p>
              At Forms Chief, we believe that every piece of data has a story to
              tell, and we're here to help you uncover those stories.
            </p>
            <p>
              Whether you're a seasoned professional or new to the world of
              data, our platform provides the tools and insights you need to
              make data work for you. With user-friendly form creation, powerful
              analysis, and customizable survey options, Forms Chief offers a
              comprehensive solution for individuals and businesses alike. We're
              more than just a tool; we're your partner in data excellence. Join
              us on this data-driven journey, and discover the possibilities
              that Forms Chief brings to your fingertips
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
