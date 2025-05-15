import { LegendProps } from "recharts";
import { ChartConfig } from "@/components/ui/chart"; // Adjust path if needed

const CustomLegend = (chartConfig: ChartConfig) => (props: LegendProps) => {
  const { payload } = props;
  return (
    <ul className="ml-4 mt-2">
      {payload?.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: entry.color,
              marginRight: 8,
            }}
          />
          <span style={{ color: "#1F2937", fontSize: "12px" }}>{chartConfig[entry.value]?.label || entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
