import { Link } from "react-router-dom";

const PaymentSucessPage = () => {
  return (
    <div className="grid w-full h-screen text-center place-items-center">
      <div>
        <h1 className="text-green-600">
          Payment completed <br />
        </h1>
        <Link className="text-primary" to="/dashboard/">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSucessPage;
