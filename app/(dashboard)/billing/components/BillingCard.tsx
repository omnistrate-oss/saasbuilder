import { Text } from "src/components/Typography/Typography";

type BillingCardProps = {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
};

const BillingCard: React.FC<BillingCardProps> = ({ title, icon, value }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl p-5 bg-white border border-[#E4E7EC] shadow-[0_1px_2px_0_#1018280D]">
      <div className="rounded-lg border border-[#E4E7EC] shadow-[0_1px_2px_0_#1018280D] h-12 w-12 flex items-center justify-center mb-3">
        {icon}
      </div>
      <Text
        size="medium"
        weight="semibold"
        color="#344054"
        className="mb-0.5 text-center"
      >
        {title}
      </Text>
      {value}
    </div>
  );
};

export default BillingCard;
