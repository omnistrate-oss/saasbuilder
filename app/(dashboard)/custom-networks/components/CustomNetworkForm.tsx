import CardWithTitle from "src/components/Card/CardWithTitle";

const CustomNetworkForm = () => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <CardWithTitle title="Standard Information" className="col-span-3">
        Hello World!
      </CardWithTitle>

      <CardWithTitle title="Custom Network Summary" className="col-span-1">
        Hello World!
      </CardWithTitle>
    </div>
  );
};

export default CustomNetworkForm;
