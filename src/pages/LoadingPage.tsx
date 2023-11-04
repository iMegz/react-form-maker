import Spinner from "../components/Spinner";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-2">
      <h1 className="text-5xl font-bold text-primary">Forms Chief</h1>
      <Spinner />
    </div>
  );
};

export default LoadingPage;
