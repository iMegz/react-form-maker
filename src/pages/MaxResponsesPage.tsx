import { Link } from "react-router-dom";

const MaxResponsesPage = () => {
  return (
    <div className="grid w-full h-screen text-center place-items-center">
      <div>
        <h1 className="text-danger">
          Form reached maximum number of responses <br />
        </h1>
        <Link className="text-primary" to="/dashboard/">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default MaxResponsesPage;
