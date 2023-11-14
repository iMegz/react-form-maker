import Spinner from "../components/Spinner";

const LoadingPage = ({ screen = false }: { screen?: boolean }) => {
  const minHeight = screen ? "100vh" : "100%";
  return (
    <div
      style={{ minHeight }}
      className="flex flex-col items-center justify-center w-full gap-2"
    >
      <h1 className="text-5xl font-bold text-primary">Forms Chief</h1>
      <Spinner />
    </div>
  );
};

export default LoadingPage;
