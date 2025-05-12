import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, IconButton, Stack, styled } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { accordionSummaryClasses } from "@mui/material/AccordionSummary";

import AccordionEditIcon from "src/components/Icons/AccordionEdit/AccordionEdit";
import AccordionErrorIcon from "src/components/Icons/AccordionError/AccordionError";
import AccordionValidIcon from "src/components/Icons/AccordionValid/AccordionValid";
import Switch from "src/components/Switch/Switch";

import { Text } from "../Typography/Typography";

export const ACCORDION_ICON_VARIANTS = {
  edit: "edit",
  checked: "checked",
  error: "error",
};

export default function Accordion(props) {
  //disableToggle will disable the expand and collapse feature, also hides the expand icon
  const {
    title,
    description,
    children,
    disableToggle,
    //supports 3 icon variants -> edit, checked, error
    iconVariant = ACCORDION_ICON_VARIANTS.edit,
    expanded = true,
    toggleExpand,
    disabled,
    arrowToggle,
    customIconComponent,
    ...restProps
  } = props;

  let IconComponent = AccordionEditIcon;
  if (iconVariant === ACCORDION_ICON_VARIANTS.checked) IconComponent = AccordionValidIcon;
  if (iconVariant === ACCORDION_ICON_VARIANTS.error) IconComponent = AccordionErrorIcon;

  let ToggleIcon = <Switch disabled={disabled} checked={expanded} onChange={toggleExpand} data-cy="accordion-toggle" />;

  if (arrowToggle)
    ToggleIcon = (
      <IconButton onClick={toggleExpand} data-cy="accordion-toggle">
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    );

  return (
    <AccordionContainer expanded={expanded} disableToggle={disableToggle} {...restProps}>
      <AccordionSummary expandIcon={!disableToggle && ToggleIcon}>
        <Stack direction="row" gap="10px" alignItems="center">
          {customIconComponent ? (
            customIconComponent
          ) : (
            <IconComponent style={{ alignSelf: "flex-start", marginTop: "4px" }} />
          )}
          <Box>
            <Text size="medium" weight="medium">
              {title}
            </Text>
            <Text size="small" weight="regular" color="#6f7174" mt="4px" mr="48px">
              {description}
            </Text>
          </Box>
        </Stack>
      </AccordionSummary>
      {children && <AccordionDetails>{children}</AccordionDetails>}
    </AccordionContainer>
  );
}

export const AccordionContainer = styled(MuiAccordion, {
  shouldForwardProp: (prop) => {
    return !["disableToggle"].includes(prop);
  },
})(() => ({
  boxShadow: "0px 4px 30px 0px rgba(46, 45, 116, 0.05)",
  border: "1px solid #EAECF0",
  background: "#FAFAFD",
  margin: "16px 0px",
  "&.Mui-disabled": {
    background: "#FAFAFD",
  },
  "&::before": {
    height: 0,
  },
  //pointerEvents: disableToggle ? "none" : "auto",
}));

export const AccordionSummary = styled(MuiAccordionSummary)(() => ({
  borderBottom: "1px solid #EAECF0",
  padding: "10px 20px",
  userSelect: "text",

  "&.Mui-disabled": {
    opacity: 1,
  },
  ["& .MuiAccordionSummary-expandIconWrapper.Mui-expanded"]: {
    transform: "none",
  },
  [`&.${accordionSummaryClasses.expanded}`]: {
    minHeight: "0px",
  },
  [`&.${accordionSummaryClasses.root}:hover:not(.Mui-disabled)`]: {
    cursor: "auto",
  },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: "0px",
  },
  [`& .${accordionSummaryClasses.content}.${accordionSummaryClasses.expanded}`]: {
    margin: "0px",
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: "20px",
}));
