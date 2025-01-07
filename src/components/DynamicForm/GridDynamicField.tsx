import { Field } from "./types";
import { PasswordInput, SelectField, TextInput } from "./Common";

type GridDynamicFieldProps = {
  field: Field;
  formData: any;
};

const GridDynamicField: React.FC<GridDynamicFieldProps> = ({
  field,
  formData,
}) => {
  const { type, isHidden, customComponent } = field;

  if (isHidden) {
    return null;
  }

  let Field: null | React.ReactNode = null;

  if (customComponent) {
    Field = customComponent;
  } else if (type === "text" || type === "description" || type === "number") {
    Field = <TextInput field={field} formData={formData} />;
  } else if (type === "password") {
    Field = <PasswordInput field={field} formData={formData} />;
  } else if (type === "select") {
    Field = <SelectField field={field} formData={formData} />;
  }

  return <div className="">{Field}</div>;
};

export default GridDynamicField;
