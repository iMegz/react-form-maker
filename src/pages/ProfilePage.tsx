import Spinner from "../components/Spinner";
import useRequest from "../hooks/useRequest";
import { useMutation, useQuery, useQueryClient } from "react-query";

function SkeletonProfile() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-5 bg-white sm:justify-start drop-shadow-md skeleton-loader">
      <div className="w-24 h-24 bg-gray-200 rounded-full shadow-lg"></div>
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <div className="bg-gray-200 h-7 w-52"></div>
        <div className="w-40 h-6 bg-gray-200"></div>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const request = useRequest();
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryFn: request<Subscription>("/stats/get/sub"),
    queryKey: ["subscription"],
  });

  const origin = `https://${import.meta.env.VITE_AUTH0_DOMAIN}`;
  const userInfoQuery = useQuery({
    queryFn: request<UserInfo>("/userinfo", { origin }),
    queryKey: ["userinfo"],
  });

  const subscriptionMutation = useMutation({
    mutationFn: request<{ url: string }>("/subscription/subscribe", {
      method: "post",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
    },
  });

  async function onClick() {
    subscriptionMutation.mutate();
    const url = subscriptionMutation.data?.data.url;
    if (url) window.location.replace(url);
  }

  function renderUserInfo() {
    if (!userInfoQuery.isSuccess) return <SkeletonProfile />;
    const userInfo = userInfoQuery.data.data;
    const { email, family_name, given_name, picture } = userInfo;

    const fullName = `${given_name} ${family_name}`;
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 p-5 bg-white sm:justify-start drop-shadow-md">
        <img
          src={picture}
          className="w-24 h-24 rounded-full shadow-lg"
          alt="Profile picture"
        />
        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-xl font-semibold capitalize">{fullName}</h2>
          <h2 className="text-lg">{email}</h2>
        </div>
      </div>
    );
  }

  function renderSub() {
    if (!subscriptionQuery.isSuccess) return <Spinner />;
    const sub = subscriptionQuery.data.data;
    if (sub.subscription === "Free")
      return (
        <button className="btn-primary" onClick={onClick}>
          Subscribe
        </button>
      );

    const end = new Date(sub.end).toDateString();

    return (
      <h3 className="text-base text-gray-500">
        Active until
        <span className="text-primary"> {end}</span>
      </h3>
    );
  }

  return (
    <div>
      <h1>Profile</h1>
      <div className="flex flex-col gap-3 w-fit">
        {renderUserInfo()}
        <div className="flex flex-col gap-6 p-5 mt-3 bg-white drop-shadow-md">
          <h2 className="text-2xl text-primary">Premium</h2>
          {renderSub()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
