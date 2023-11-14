import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import {
  CreditCardOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import InfoCard from "../components/InfoCard";

interface FormStats {
  forms: number;
  responses: number;
}

const Dashboardpage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [stats, setStats] = useState<FormStats>();
  const [subscription, setSubscription] = useState<string>();

  useEffect(() => {
    async function fetchStats() {
      const token = await getAccessTokenSilently();
      const path = `${import.meta.env.VITE_API}/stats/get/forms`;
      const authorization = `Bearer ${token}`;
      return axios.get(path, { headers: { authorization } });
    }

    async function fetchSubscription() {
      const token = await getAccessTokenSilently();
      const path = `${import.meta.env.VITE_API}/stats/get/sub`;
      const authorization = `Bearer ${token}`;
      return axios.get(path, { headers: { authorization } });
    }

    fetchSubscription().then((res) => setSubscription(res.data.subscription));

    fetchStats().then((res) => {
      setStats(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex flex-wrap gap-8">
        <InfoCard
          title="Subscription"
          value={subscription}
          Icon={CreditCardOutlined}
          color="#3b82f6"
        />
        <InfoCard
          title="Forms"
          value={stats?.forms}
          Icon={FormOutlined}
          color="#facc15"
        />

        <InfoCard
          title="Responses"
          value={stats?.responses}
          Icon={UnorderedListOutlined}
          color="#dc2626"
        />
      </div>
    </div>
  );
};

export default Dashboardpage;
