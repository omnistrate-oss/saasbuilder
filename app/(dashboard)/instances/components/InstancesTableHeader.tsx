import { useMemo } from "react";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const InstancesTableHeader = () => {
  const actions = useMemo(() => {
    const res = [];

    return res;
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-6">
      <DataGridHeaderTitle
        title="List of Instances"
        desc="Details of instances"
        count={0}
        units={{ singular: "Instance", plural: "Instances" }}
      />

      <div className="flex items-center gap-3"></div>
    </div>
  );
};

export default InstancesTableHeader;
