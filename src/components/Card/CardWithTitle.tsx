import { Text } from "../Typography/Typography";

type CardWithTitleProps = {
  title: string;
  children: React.ReactNode;
};

const CardWithTitle: React.FC<CardWithTitleProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E9EAEB] shadow-[0_1px_2px_0_#0A0D120D]">
      <div className="py-5 px-6 border-b border-[#E9EAEB]">
        <Text size="large" weight="semibold" color="#0E5FB5">
          {title}
        </Text>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
};

export default CardWithTitle;
