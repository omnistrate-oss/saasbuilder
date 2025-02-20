import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FC } from "react";
import Button from "src/components/Button/Button";
import CopyButton from "src/components/Button/CopyButton";
import { Text } from "src/components/Typography/Typography";
import { styleConfig } from "src/providerConfig";

export type ListItemProps = {
  title: string;
  value?: string;
  icon?: React.ReactNode;
};

type PeeringInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  list: ListItemProps[];
};

const PeeringInfoIcon = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.1667 10.5C22.1667 15.0103 18.5103 18.6666 14 18.6666M22.1667 10.5C22.1667 5.98965 18.5103 2.33331 14 2.33331M22.1667 10.5H5.83333M14 18.6666C9.48967 18.6666 5.83333 15.0103 5.83333 10.5M14 18.6666C16.0427 16.4303 17.2046 13.5282 17.2677 10.5C17.2046 7.47181 16.0427 4.56963 14 2.33331M14 18.6666C11.9573 16.4303 10.7975 13.5282 10.7344 10.5C10.7975 7.47181 11.9573 4.56963 14 2.33331M14 18.6666V21M5.83333 10.5C5.83333 5.98965 9.48967 2.33331 14 2.33331M16.3333 23.3333C16.3333 24.622 15.2887 25.6666 14 25.6666C12.7113 25.6666 11.6667 24.622 11.6667 23.3333M16.3333 23.3333C16.3333 22.0446 15.2887 21 14 21M16.3333 23.3333H24.5M11.6667 23.3333C11.6667 22.0446 12.7113 21 14 21M11.6667 23.3333H3.5"
        stroke={styleConfig.secondaryIconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ListItem: FC<ListItemProps> = ({ title, value, icon }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p="16px"
      borderRadius="6px"
      border="1px solid #EAECF0"
      mb="12px"
    >
      <Text size="small" weight="medium" color="#344054">
        {title}
      </Text>

      <Box display="flex" alignItems="center" gap="8px">
        {icon && icon}
        <Text size="small" weight="semibold" color="#475467">
          {value}
        </Text>
        <CopyButton text={value} />
      </Box>
    </Stack>
  );
};

const PeeringInfoDialog: FC<PeeringInfoDialogProps> = ({
  open,
  onClose,
  list,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "12px",
          minWidth: "480px",
          maxWidth: "480px",
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: "24px",
          pb: "20px",
        }}
      >
        <Stack direction="row" gap="4px" alignItems="center">
          <PeeringInfoIcon />
          <Text size="large" weight="semibold" color="#101828">
            Peering Info
          </Text>
        </Stack>
        <Text size="small" weight="regular" color="#475467" sx={{ mt: "4px" }}>
          Basic information for setting up VPC peering
        </Text>
      </DialogTitle>
      <DialogContent sx={{ pb: "20px" }}>
        {list?.length <= 1 ? (
          <Text
            size="small"
            weight="semibold"
            sx={{ textAlign: "center", my: "16px" }}
          >
            Peering information will be available once the setup is complete.
            Please check back shortly.
          </Text>
        ) : (
          list.map((item, index) => (
            <ListItem
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))
        )}
      </DialogContent>
      <DialogActions sx={{ pt: "0px", pr: "24px", pb: "24px" }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PeeringInfoDialog;
