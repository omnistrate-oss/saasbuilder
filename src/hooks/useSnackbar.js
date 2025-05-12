import  { useContext } from "react";

import { SnackbarContext } from "../components/SnackbarProvider/SnackbarProvider";

function useSnackbar() {
  const snackbar = useContext(SnackbarContext);
  return snackbar;
}

export default useSnackbar;
