import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const SnackbarContext = React.createContext();

const types = {
  error: "error",
  success: "success",
  warning: "warning",
  info: "info",
};

export default function SnackbarProvider(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState(types.success);
  const [message, setMessage] = useState("");

  function showSuccess(msg) {
    setMessage(msg);
    setVariant(types.success);
    setIsOpen(true);
  }

  function showError(msg) {
    setMessage(msg);
    setVariant(types.error);
    setIsOpen(true);
  }

  function showInfo(msg) {
    setMessage(msg);
    setVariant(types.info);
    setIsOpen(true);
  }

  function showWarning(msg) {
    setMessage(msg);
    setVariant(types.info);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setMessage("");
  }

  return (
    <SnackbarContext.Provider
      value={{
        message,
        variant,
        isOpen,
        showError,
        showSuccess,
        showInfo,
        showWarning,
        handleClose,
      }}
    >
      {props.children}
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity={variant} sx={{ width: "100%", fontWeight: 500 }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
