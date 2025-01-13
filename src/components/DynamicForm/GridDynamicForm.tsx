import React from "react";
import { styleConfig } from "src/providerConfig";
import { FormMode } from "src/types/common/enums";

import { FormConfiguration } from "./types";
import GridDynamicField from "./GridDynamicField";

import Button from "../Button/Button";
import { Text } from "../Typography/Typography";
import CardWithTitle from "../Card/CardWithTitle";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import Form from "../FormElementsv2/Form/Form";
import { colors } from "src/themeConfig";

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
  const values = formData.values;

  return (
    // @ts-ignore
    <Form
      data-testid={formConfiguration.dataTestId || "dynamic-form"}
      className="flex items-start gap-8"
      onSubmit={formData.handleSubmit}
    >
      <div style={{ flex: 5 }}>
        {sections.map((section, index) => {
          return (
            <CardWithTitle key={index} title={section.title}>
              <div className="space-y-6">
                {section.fields.map((field, index) => {
                  return (
                    <GridDynamicField
                      key={index}
                      field={field}
                      formData={formData}
                    />
                  );
                })}
              </div>
            </CardWithTitle>
          );
        })}
      </div>

      <div
        style={{
          position: "sticky",
          top: "24px",
          flex: 2,
          minHeight: "660px",
          border: `1px solid ${colors.purple600}`,
          boxShadow: "0px 2px 2px -1px #0A0D120A, 0px 4px 6px -2px #0A0D1208",
        }}
        className="bg-white rounded-xl flex flex-col"
      >
        <div className="py-4 px-6 border-b border-gray-200">
          <Text size="large" weight="semibold" color={colors.purple700}>
            {previewCardTitle || "Preview"}
          </Text>
        </div>

        <div className="px-4 py-4 flex-1">
          {sections.map((section, index) => {
            return (
              <div key={index}>
                <Text
                  size="small"
                  weight="semibold"
                  color={colors.purple700}
                  sx={{ mb: "10px" }}
                >
                  {section.title}
                </Text>

                <div
                  className="grid grid-cols-5"
                  style={{
                    gap: "10px 8px",
                  }}
                >
                  {section.fields.map((field, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div
                          style={{
                            gridColumn: "span 2 / span 2",
                          }}
                        >
                          <Text size="small" weight="medium" color="#414651">
                            {field.label}
                          </Text>
                        </div>
                        <div className="col-span-3 flex">
                          <div style={{ margin: "-3px 8px 0px 0px" }}>:</div>
                          <div>
                            {field.previewValue ? (
                              <field.previewValue
                                field={field}
                                formData={formData}
                              />
                            ) : typeof values[field.name] === "string" ? (
                              <Text
                                size="small"
                                weight="medium"
                                color="#181D27"
                              >
                                {/* TODO: Fix the Overflow Ellipses Issue */}
                                {values[field.name]}
                              </Text>
                            ) : null}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            margin: "0px 16px 20px",
            paddingTop: "20px",
            borderTop: "1px solid #E9EAEB",
          }}
          className="flex items-center gap-3"
        >
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
    </Form>
  );
};

export default GridDynamicForm;
