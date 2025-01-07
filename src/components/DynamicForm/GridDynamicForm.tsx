import { FormMode } from "src/types/common/enums";
import CardWithTitle from "../Card/CardWithTitle";
import GridDynamicField from "./GridDynamicField";
import { Text } from "../Typography/Typography";
import Button from "../Button/Button";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import { styleConfig } from "src/providerConfig";
import { FormConfiguration } from "./types";

type GridDynamicFormProps = {
  formData: any;
  formConfiguration: FormConfiguration;
  formMode: FormMode;
  isFormSubmitting?: boolean;
  onClose: () => void;
  disableSubmit?: boolean;
  previewCardTitle?: string;
};

const GridDynamicForm: React.FC<GridDynamicFormProps> = ({
  formConfiguration,
  formData,
  formMode,
  isFormSubmitting,
  onClose,
  disableSubmit,
  previewCardTitle,
}) => {
  const sections = formConfiguration.sections || [];
  const footer = formConfiguration.footer;

  return (
    <div className="flex gap-8">
      <div className="flex-[5]">
        {sections.map((section, index) => {
          return (
            <CardWithTitle key={index} title={section.title}>
              {section.fields.map((field, index) => {
                return (
                  <GridDynamicField
                    key={index}
                    field={field}
                    formData={formData}
                  />
                );
              })}
            </CardWithTitle>
          );
        })}
      </div>

      <div className="flex-[2] min-h-[660px] flex flex-col border border-[#127AE8] shadow-[0_2px_2px_-1px_#0A0D120A]">
        <div className="py-4 px-6 border-b border-[#E9EAEB]">
          <Text size="large" weight="semibold">
            {previewCardTitle || "Preview"}
          </Text>
        </div>

        <div className="p-4">
          {sections.map((section, index) => {
            return (
              <div key={index}>
                <Text
                  size="small"
                  weight="semibold"
                  color={styleConfig.primaryColor}
                  sx={{ mb: "10px" }}
                >
                  {section.title}
                </Text>

                {/* {section.fields.map((field, index) => {
                  return (
                    <div key={index} className="flex gap-2">
                      <Text size="small" weight="semibold">
                        {field.label}
                      </Text>
                      <Text size="small">{formData.values[field.name]}</Text>
                    </div>
                  );
                })} */}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-5 mx-4 mb-4 border-t border-[#E9EAEB]">
          {onClose && (
            <Button
              data-testid="cancel-button"
              variant="outlined"
              onClick={onClose}
              disabled={isFormSubmitting}
              sx={{ marginLeft: "auto" }} // Pushes the 2 buttons to the end
            >
              Cancel
            </Button>
          )}
          {footer.submitButton[formMode] && (
            <Button
              data-testid="submit-button"
              variant="contained"
              disabled={isFormSubmitting || disableSubmit}
              type="submit"
            >
              {formConfiguration.footer.submitButton[formMode] || "Submit"}
              {isFormSubmitting && <LoadingSpinnerSmall />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridDynamicForm;
