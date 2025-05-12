import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack } from "@mui/material";
import AccordionEditIcon from "src/components/Icons/AccordionEdit/AccordionEdit";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import CopyButton from "src/components/Button/CopyButton";
import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";

export default function ResourceInstanceDialog(props) {
  const { open = false, handleClose, variant = "array", data, title, subtitle } = props;

  const isTypeJson = variant === "json";
  const chunkData = (arr, size) => {
    if (Array.isArray(data)) {
      return arr?.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
      }, []);
    } else {
      return [];
    }
  };

  const rows = isTypeJson ? data : chunkData(data, 2);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      minWidth="xl"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" gap="10px">
          <Box>
            <AccordionEditIcon />
          </Box>
          <Box display="flex" flexDirection={"column"} gap="4px" mt="4px">
            <Text size="small" weight="semibold" color="#101828" sx={{ flex: 1, wordBreak: "break-word" }}>
              {title}
            </Text>
            <Text size="small" weight="regular" color="#344054" sx={{ flex: 1, wordBreak: "break-word" }}>
              {subtitle}
            </Text>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isTypeJson ? (
          <FieldContainer>
            <FieldLabel sx={{ mt: "5px", fontSize: "16px" }}>{subtitle}</FieldLabel>
          </FieldContainer>
        ) : (
          <Box width="600px">
            {rows?.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                display="flex"
                mt="12px"
                sx={{
                  border: "1px solid #E4E7EC",
                  padding: "8px",
                  display: "flex",
                  borderRadius: "8px",
                  flex: 1,
                }}
              >
                {row.map((value, index) => (
                  <Box
                    key={index}
                    display="flex"
                    flex={1}
                    alignItems="center"
                    padding="4px 20px"
                    borderLeft={index === 1 ? "1px solid #E4E7EC" : "none"}
                  >
                    <Text size="small" weight="regular" color="#6941C6" sx={{ flex: 1, wordBreak: "break-word" }}>
                      {value}
                    </Text>
                    <CopyButton
                      text={value}
                      iconProps={{ color: "#6941C6", width: 20, height: 20 }}
                      iconStyle={{ flexShrink: 0 }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            minWidth: "100px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid rgba(253, 162, 155, 1)",
            borderRadius: "8px",
            boxShadow:
              "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px -2px 0px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 1px rgba(16, 24, 40, 0.18)",
          }}
          style={{ color: "rgba(217, 45, 32, 1)" }}
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
