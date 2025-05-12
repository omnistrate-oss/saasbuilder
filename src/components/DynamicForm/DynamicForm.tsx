import { FC } from "react";
import { Box, Stack } from "@mui/material";

import Accordian from "src/components/Accordion/Accordion";
import FormDescription from "src/components/FormElements/FormDescription/FormDescription";
import FormTitle from "src/components/FormElements/FormTitle/FormTitle";

import Button from "../Button/Button";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import Form from "../FormElementsv2/Form/Form";

import DynamicField from "./DynamicField";

type DynamicFormProps = {
  formData: any;
  formConfiguration: any;
  formMode: string;
  isFormSubmitting?: boolean;
  onDelete?: () => void;
  onClose: () => void;
  disableSubmit?: boolean;
};

const DynamicForm: FC<DynamicFormProps> = ({
  formConfiguration,
  formData,
  formMode,
  isFormSubmitting,
  onDelete,
  onClose,
  disableSubmit,
}) => {
  return (
    // @ts-ignore
    <Form
      data-testid={formConfiguration.dataTestId || "dynamic-form"}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "20px",
      }}
      onSubmit={formData.handleSubmit}
    >
      {/* Header */}
      <Box>
        <FormTitle>{formConfiguration.title[formMode]}</FormTitle>
        <FormDescription>{formConfiguration.description[formMode]}</FormDescription>
      </Box>

      {/* Content */}
      <Box flex="1" sx={{ overflowY: "auto" }}>
        {formConfiguration.accordions.map((accordion) => {
          return (
            <Accordian
              key={accordion.title}
              disableToggle
              title={accordion.title}
              description={accordion.description}
              iconVariant={accordion.iconVariant}
            >
              {accordion.fields.map((field) => {
                if (field.isHidden) {
                  return null;
                }

                return <DynamicField key={field.label} field={field} formData={formData} />;
              })}
            </Accordian>
          );
        })}
      </Box>

      {/* Footer */}
      <Stack direction="row" gap="12px" borderTop="1px solid #EAECF0" pt="16px">
        {onDelete && (
          <Button
            data-testid="delete-button"
            variant="contained"
            onClick={onDelete}
            bgColor="#CF4027"
            sx={{
              display: formMode === "create" ? "none" : "block",
            }}
            disabled={isFormSubmitting}
          >
            Delete
          </Button>
        )}
        <Button
          data-testid="cancel-button"
          variant="outlined"
          onClick={onClose}
          disabled={isFormSubmitting}
          sx={{ marginLeft: "auto" }} // Pushes the 2 buttons to the end
        >
          Cancel
        </Button>
        {formMode !== "view" && (
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
      </Stack>
    </Form>
  );
};

export default DynamicForm;
