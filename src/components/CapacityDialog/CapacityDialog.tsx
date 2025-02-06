import React, { FC, useMemo } from "react";
import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import {
  addCapacityResourceInstanceAccess,
  removeCapacityResourceInstanceAccess,
} from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";
import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import Form from "components/FormElements/Form/Form";
import { Text } from "../Typography/Typography";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import { AccessCapacityDataType, CapacityAction, ContextType } from "./enums";
import CapacityIcon from "../Icons/Capacity/CapacityIcon";

// Styled Components
const Dialog = styled(MuiDialog)(() => ({
  "& .MuiPaper-root": {
    width: "100%",
    maxWidth: "521px",
    padding: "24px",
  },
}));

const DialogTitle = styled(MuiDialogTitle)({
  padding: 0,
});

const DialogContent = styled(MuiDialogContent)({
  padding: 0,
});

const DialogActions = styled(MuiDialogActions)({
  padding: 0,
  paddingTop: 30,
});

type CapacityDialogProps = {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  data: AccessCapacityDataType;
  currentCapacityAction: CapacityAction;
  contextType?: ContextType;
  autoscaling?: {
    currentReplicas?: string;
    maxReplicas?: string;
    minReplicas?: string;
  };
};

const CapacityDialog: FC<CapacityDialogProps> = ({
  open,
  handleClose,
  data,
  currentCapacityAction,
  refetch,
  autoscaling,
}) => {
  const snackbar = useSnackbar();
  const currentReplicas = Number(autoscaling?.currentReplicas);
  const maxReplicas = Number(autoscaling?.maxReplicas);
  const minReplicas = Number(autoscaling?.minReplicas);

  const capacityMutation = useMutation(
    async (payload: { count: number }) => {
      if (currentCapacityAction === "add") {
        return await addCapacityResourceInstanceAccess({
          count: payload.count,
          data: data as AccessCapacityDataType,
        });
      } else if (currentCapacityAction === "remove") {
        return await removeCapacityResourceInstanceAccess({
          count: payload.count,
          data: data as AccessCapacityDataType,
        });
      }
    },
    {
      onSuccess: () => {
        snackbar.showSuccess(`Capacity ${labelObj.successLabel} successfully`);
        /*eslint-disable-next-line no-use-before-define*/
        capacityFormik.resetForm();
        handleClose();
        refetch();
      },
    }
  );

  const errorMessage = useMemo(() => {
    if (currentCapacityAction === "add") {
      return maxReplicas - currentReplicas === 0
        ? `Error: Replicas already at maximum, cannot add capacity.`
        : `Error: Number of replicas must be between 1 and ${
            maxReplicas - currentReplicas
          }`;
    } else {
      return minReplicas - currentReplicas === 0
        ? `Error: Replicas already at minimum, cannot reduce capacity.`
        : `Error: Number of replicas must be between 1 and ${
            currentReplicas - minReplicas
          }`;
    }
  }, [currentCapacityAction, currentReplicas, minReplicas, maxReplicas]);

  const capacityFormik = useFormik({
    initialValues: {
      count: 1,
    },
    validationSchema: Yup.object().shape({
      count: Yup.number()
        .required("Number of replicas is required")
        .min(1, errorMessage)
        .test("max-capacity", function (value) {
          if (value === undefined || value === null) return false;

          if (currentCapacityAction === "add") {
            if (value > maxReplicas || currentReplicas + value > maxReplicas) {
              return this.createError({ message: errorMessage });
            }
          } else {
            if (
              currentReplicas - value < minReplicas ||
              currentReplicas - value < 0
            ) {
              return this.createError({ message: errorMessage });
            }
          }

          return true;
        }),
    }),
    onSubmit: (values) => {
      capacityMutation.mutate(values);
    },
  });
  const labelObj = useMemo(() => {
    const isAddingCapacity = currentCapacityAction === "add";

    const title = isAddingCapacity ? "Add Capacity" : "Remove Capacity";
    const subtitle = isAddingCapacity
      ? "Number of Replicas to Add"
      : "Number of Replicas to Remove";

    const buttonLabel = isAddingCapacity ? "Add" : "Remove";
    const buttonColor = isAddingCapacity ? "#7F56D9" : "#D92D20";
    const successLabel = isAddingCapacity ? "added" : "removed";

    const message = isAddingCapacity
      ? `You can add up to ${maxReplicas - currentReplicas} more ${
          maxReplicas - currentReplicas > 1 ? "replicas" : "replica"
        }. You currently have ${currentReplicas} out of a maximum of ${maxReplicas}`
      : `You can remove ${currentReplicas - minReplicas} ${
          currentReplicas - minReplicas > 1 ? "replicas" : "replica"
        }. You currently have ${currentReplicas}, and the minimum required is ${minReplicas}`;

    return { title, subtitle, message, buttonLabel, buttonColor, successLabel };
  }, [currentCapacityAction, currentReplicas, minReplicas, maxReplicas]);

  return (
    <Dialog data-cy="confirmation-dialog" open={open} onClose={handleClose}>
      {/* @ts-ignore */}
      <Form
        //@ts-ignore
        onSubmit={capacityFormik.handleSubmit}
      >
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap="16px">
              <CapacityIcon />
              <Text size="large" weight="bold">
                {labelObj.title}
              </Text>
            </Stack>
            <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {!!labelObj.subtitle && (
            <Text
              size="medium"
              weight="semibold"
              //@ts-ignore
              mt="20px"
            >
              {labelObj.subtitle}
            </Text>
          )}
          {!!labelObj.message && (
            <Text
              size="small"
              weight="medium"
              color="#344054"
              //@ts-ignore
              mt="9px"
            >
              {labelObj.message}
            </Text>
          )}

          <TextField
            //@ts-ignore
            id="count"
            name="count"
            type="number"
            value={capacityFormik.values.count}
            onChange={capacityFormik.handleChange}
            onBlur={capacityFormik.handleBlur}
            error={
              capacityFormik.touched.count &&
              Boolean(capacityFormik.errors.count)
            }
            helperText={
              capacityFormik.touched.count && capacityFormik.errors.count
            }
            sx={{
              marginTop: "16px",
              [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
                borderColor: "rgba(254, 228, 226, 1) !important",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={capacityMutation.isLoading}
            onClick={() => {
              handleClose();
              capacityFormik.resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={capacityMutation.isLoading}
          >
            {labelObj.buttonLabel}
            {capacityMutation.isLoading && <LoadingSpinnerSmall />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default CapacityDialog;
