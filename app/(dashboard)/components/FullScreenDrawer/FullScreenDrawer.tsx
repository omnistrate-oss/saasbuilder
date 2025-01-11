import React from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import FullScreenDrawerNavbar from "./FullScreenDrawerNavbar";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type FullScreenDrawerProps = {
  open: boolean;
  closeDrawer: () => void;
  RenderUI: React.ReactNode;
  title?: string;
  description?: string;
};

const FullScreenDrawer: React.FC<FullScreenDrawerProps> = ({
  open,
  closeDrawer,
  RenderUI,
  title,
  description,
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={closeDrawer}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: "#FCFCFC",
        },
      }}
    >
      <FullScreenDrawerNavbar
        title={title}
        description={description}
        closeDrawer={closeDrawer}
      />
      <div className="px-4 py-6 max-w-[84rem] w-full mx-auto">{RenderUI}</div>
    </Dialog>
  );
};

export default FullScreenDrawer;
