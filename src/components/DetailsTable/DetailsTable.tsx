import { Text } from "../Typography/Typography";

type DetailsTableProps = {
  columns: {
    title: string;
    content: React.ReactNode;
  }[];
};

const DetailsTable: React.FC<DetailsTableProps> = ({ columns }) => {
  return (
    <div
      className="grid rounded-xl border border-[#E9EAEB] shadow-[0_1px_2px_0_#0A0D120D] overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          className="bg-[#FAFAFA] border-b border-[#E9EAEB]"
          style={{ padding: "12px 24px" }}
        >
          <Text size="xsmall" weight="semibold" color="#717680">
            {column.title}
          </Text>
        </div>
      ))}

      {columns.map((column, index) => (
        <div
          key={index}
          className="flex items-center px-6"
          style={{ height: "48px" }}
        >
          {typeof column.content === "string" ? (
            <Text
              size="small"
              weight="regular"
              color="#475467"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {column.content}
            </Text>
          ) : (
            column.content
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailsTable;
