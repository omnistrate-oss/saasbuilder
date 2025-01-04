import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const AccessControlTableHeader = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-6">
      <DataGridHeaderTitle
        title="Manage Access"
        desc="Manage your Users and their account permissions here"
      />
    </div>
  );
};

export default AccessControlTableHeader;
