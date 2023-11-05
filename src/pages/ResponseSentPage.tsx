import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResponseSentPage = () => {
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (counter === 0) navigate("/");
      setCounter(counter - 1);
    }, 1000);
  }, [counter]);

  return (
    <div className="grid w-full h-screen place-items-center">
      <h1 className="text-center">
        Response sent. <br />
        <span className="text-gray-500">Redirecting to home page in</span>
        <span> {counter}</span>
      </h1>
    </div>
  );
};

export default ResponseSentPage;
