import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import useRequest from "../hooks/useRequest";

interface UserInfo {
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  [key: string]: string | boolean;
}

interface FreeSubscription {
  subscription: "Free";
}
interface PremiumSubscription {
  subscription: "Premium";
  start: string;
  end: string;
}

type Subscription = FreeSubscription | PremiumSubscription;

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
  const [sub, setSub] = useState<Subscription>();
  const [userInfo, setUserInof] = useState<UserInfo>();
  const request = useRequest();

  async function onClick() {
    const res = await request("/subscription/subscribe", { method: "post" });
    const url = res.data.url;
    window.location.replace(url);
  }

  useEffect(() => {
    const origin = `https://${import.meta.env.VITE_AUTH0_DOMAIN}`;
    request("/userinfo", { origin }).then((res) => setUserInof(res.data));
    request("/stats/get/sub").then((res) => setSub(res.data));
  }, []);

  function renderUserInfo() {
    if (!userInfo) return <SkeletonProfile />;
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
    if (!sub) return <Spinner />;
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
