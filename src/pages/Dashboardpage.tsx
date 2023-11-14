import { useEffect, useState } from "react";
import {
  CreditCardOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import InfoCard from "../components/InfoCard";
import useRequest from "../hooks/useRequest";

interface FormStats {
  forms: number;
  responses: number;
}

const Dashboardpage = () => {
  const [stats, setStats] = useState<FormStats>();
  const [subscription, setSubscription] = useState<string>();
  const request = useRequest();

  useEffect(() => {
    request("/stats/get/forms").then((res) => {
      setStats(res.data);
    });

    request("/stats/get/sub").then((res) =>
      setSubscription(res.data.subscription)
    );
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
