import {
  CreditCardOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import InfoCard from "../components/InfoCard";
import useRequest from "../hooks/useRequest";
import { useQuery } from "react-query";

interface FormStats {
  forms: number;
  responses: number;
}

const DashboardPage = () => {
  const request = useRequest();

  const formsStatsQuery = useQuery({
    queryFn: request<FormStats>("/stats/get/forms"),
    queryKey: ["forms", "responses"],
    staleTime: 30_000, // 30 seconds
  });

  const subscriptionQuery = useQuery({
    queryFn: request<Subscription>("/stats/get/sub"),
    queryKey: ["subscription"],
  });

  const stats = formsStatsQuery.data?.data;
  const subscription = subscriptionQuery.data?.data.subscription;

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

export default DashboardPage;
