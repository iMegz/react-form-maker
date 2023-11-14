import Spinner from "./Spinner";

interface InfoCardProps {
  color: string;
  title: string;
  Icon: React.ComponentType<any>;
  value?: number | string;
}

const InfoCard = ({ color, Icon, title, value }: InfoCardProps) => {
  return (
    <div
      className="flex flex-col gap-2 p-5 bg-white border-b-4 drop-shadow-md rounded-t-md w-72"
      style={{ borderBottomColor: color }}
    >
      <h2 className="text-gray-600">{title}</h2>
      <div className="flex items-center justify-between">
        <span className="text-2xl">
          {value || <Spinner style={{ fill: color }} />}
        </span>
        <Icon style={{ color }} />
      </div>
    </div>
  );
};

export default InfoCard;
