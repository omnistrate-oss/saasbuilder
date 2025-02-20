import React, { useEffect, useMemo } from "react";
import InformationDialogTopCenter from "../Dialog/InformationDialogTopCenter";
import { useFormik } from "formik";
import RestoreInstanceFormStep from "./RestoreInstanceFormStep";
import RestoreInstanceSuccessStep from "./RestoreInstanceSuccessStep";
import { SetState } from "src/types/common/reactGenerics";
import { restoreFormikSchema } from "src/constants/restore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { dateToTimeString } from "src/utils/time";
dayjs.extend(utc);

type RestoreInstanceModalProps = {
  open: boolean;
  handleClose: () => void;
  earliestRestoreTime: string;
  restoreMutation: any;
  networkType: string;
  step: number;
  setStep: SetState<number>;
  restoredInstanceID?: string;
};

function RestoreInstanceModal({
  open,
  handleClose,
  earliestRestoreTime,
  restoreMutation,
  networkType,
  step,
  setStep,
  restoredInstanceID,
}: RestoreInstanceModalProps) {
  const initialDateValue = useMemo(() => {
    if (earliestRestoreTime) {
      const date = dayjs
        .utc(new Date(earliestRestoreTime))
        .add(1, "minute")
        .toDate();
      return date;
    }

    return new Date();
  }, [earliestRestoreTime]);

  const restoreFormik = useFormik({
    initialValues: {
      earliestRestoreTime: earliestRestoreTime
        ? dayjs.utc(earliestRestoreTime)
        : null,
      date: dayjs.utc(initialDateValue).startOf("day"),
      time: dateToTimeString(initialDateValue),
    },
    validationSchema: restoreFormikSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const dateTimeString =
        values.date.format("YYYY-MM-DD") + "T" + values.time + "Z";
      const utcTimeString = dayjs.utc(dateTimeString)?.toISOString();
      restoreMutation.mutate({
        targetRestoreTime: utcTimeString,
        network_type: networkType,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      restoreFormik.resetForm();
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <InformationDialogTopCenter
      open={open}
      handleClose={handleClose}
      maxWidth={step === 1 ? "650px" : "550px"}
    >
      {step === 1 && (
        <RestoreInstanceFormStep
          restoreFormik={restoreFormik}
          restoreMutation={restoreMutation}
          handleClose={handleClose}
          earliestRestoreTime={earliestRestoreTime}
        />
      )}
      {step === 2 && (
        <RestoreInstanceSuccessStep
          handleClose={handleClose}
          restoredInstanceID={restoredInstanceID}
        />
      )}
    </InformationDialogTopCenter>
  );
}

export default RestoreInstanceModal;
