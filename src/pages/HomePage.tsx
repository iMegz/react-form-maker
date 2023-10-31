import HomeNavbar from "../components/HomeNavbar";
import hero from "../assets/heroImg.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { features, plans } from "../lib/homePageData";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { FormEvent } from "react";

const HomePage = () => {
  const { loginWithRedirect } = useAuth0();

  function handleSubmitContactForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function pricingFeature(value: boolean | string) {
    if (typeof value === "string") return value;
    return value ? (
      <CheckCircleFilled className="text-green-500" />
    ) : (
      <CloseCircleFilled className="text-red-500" />
    );
  }

  return (
    <main className="w-full min-h-screen">
      <nav className="p-5 bg-white drop-shadow-md">
        <HomeNavbar />
      </nav>
      <div className="flex items-center px-5 justify-center gap-8 w-full min-h-[calc(100vh-84px)] bg-blue-100 drop-shadow-sm">
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
      <section id="about">
        <div className="container">
          <h2>
            What is
            <span className="font-semibold text-primary"> Forms Chief </span>?
          </h2>
          <hr />
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

      {/* Features */}
      <section id="features" className="bg-white">
        <div className="container">
          <h2>
            Why
            <span className="font-semibold text-primary"> Forms Chief </span>?
          </h2>
          <hr />
          <ul className="flex flex-col items-center gap-6 lg:gap-3 lg:flex-row">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="flex flex-col items-center max-w-lg px-6 text-center lg:items-start lg:text-left"
              >
                <feature.icon className="text-4xl text-primary" />
                <h3 className="mt-3 mb-1 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="container">
          <h2>Pricing</h2>
          <hr />
          <ul className="flex flex-col items-center gap-6 md:flex-row">
            {plans.map((plan) => (
              <li
                key={plan.title}
                className="flex flex-col bg-white drop-shadow-lg w-72"
              >
                <h3 className="w-full py-4 text-2xl text-center text-white bg-primary">
                  {plan.title}
                </h3>
                <div className="py-3">
                  <span className="text-5xl">{plan.price}</span>
                  <span className="text-xl"> $ / Month</span>
                </div>
                {plan.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-center justify-between p-3 odd:bg-gray-100"
                  >
                    <h4>{feature.title}</h4>
                    <span>{pricingFeature(feature.value)}</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact us */}
      <section className="bg-white" id="contact">
        <div className="container">
          <h2>Have any questions ?</h2>
          <hr />
          <form
            onSubmit={handleSubmitContactForm}
            className="flex flex-col gap-4 text-left"
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" required id="subject" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={4} />
            </div>
          </form>
        </div>
      </section>

      <footer className="py-4 text-lg text-center text-white bg-gray-600 ">
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/imegz/"
          target="_blank"
          className="font-semibold text-primary hover:text-primary-dark"
        >
          Ahmed Magdi
        </a>
      </footer>
    </main>
  );
};

export default HomePage;
