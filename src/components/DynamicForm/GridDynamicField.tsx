import { Field } from "./types";
import { PasswordInput, SelectField, TextInput } from "./Common";

import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import FieldError from "../FormElementsv2/FieldError/FieldError";
import FieldDescription from "../FormElementsv2/FieldDescription/FieldDescription";

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

  return (
    <div className="flex gap-8">
      <div style={{ width: "250px" }}>
        <FieldLabel
          required={field.required}
          sx={{ color: "#414651", fontWeight: "600" }}
        >
          {field.label}
        </FieldLabel>
        <FieldDescription sx={{ mt: 0, color: "#535862" }}>
          {field.subLabel}
        </FieldDescription>
      </div>

      <div className="flex-1">
        {Field}
        {field.description && field.description}
        <FieldError>
          {formData.touched[field.name] && formData.errors[field.name]}
        </FieldError>
      </div>
    </div>
  );
};

export default GridDynamicField;
