import {
  Box,
  Collapse,
  IconButton,
  Modal,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledButton from "../Button/Button";
import _ from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Switch from "src/components/Switch/Switch";
import { useState } from "react";
import { useCookieConsentContext } from "src/context/cookieConsentContext";
import { CategoryWithoutServices } from "src/types/cookieConsent";

export const cookieCategoryDescriptionMap: Record<string, string> = {
  necessary:
    "These are essential for functioning of the application. They can't be disabled",
  analytics:
    "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.",
};
const StyledContainer = styled(Box)<{ maxWidth?: string }>(
  ({ maxWidth = "500px" }) => ({
    position: "fixed",
    bottom: "50%",
    right: "50%",
    transform: "translate(50%, 50%)",
    background: "#ffffff",
    borderRadius: "12px",
    // border: '1px solid #364152',
    boxShadow:
      "0px 2px 2px -1px #0A0D120A, 0px 4px 6px -2px #0A0D1208, 0px 12px 16px -4px #0A0D1214",
    padding: "24px",
    width: "100%",
    maxWidth: maxWidth,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  })
);

type HeaderProps = {
  handleClose: () => void;
};

const Header = ({ handleClose }: HeaderProps) => {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      gap="16px"
    >
      <Box
        sx={{
          padding: "12px",
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #E9EAEB",
          boxShadow:
            "0px 1px 2px 0px #0A0D120D, 0px -2px 0px 0px #0A0D120D, 0px 0px 0px 1px #0A0D122E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

type CookieCategoryProps = {
  category: CategoryWithoutServices;
  // eslint-disable-next-line no-unused-vars
  handleChange: (categoryName: string) => void;
};

const CookieCategoryCard = ({
  category,
  handleChange,
}: CookieCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Box
      sx={{
        borderRadius: "12px",
        padding: "16px",
        gap: "4px",
        border: "1px solid #E9EAEB",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#414651",
          }}
        >
          {_.capitalize(category.category)}
        </Typography>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap="4px"
        >
          <Switch
            disabled={!category.editable}
            checked={category.enabled}
            onChange={() => {
              handleChange(category.category);
            }}
          />
          <IconButton onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ marginTop: "10px" }}>
        <Collapse in={isExpanded} collapsedSize={0}>
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: "18px",
              fontWeight: 400,
              color: "#535862",
            }}
          >
            {cookieCategoryDescriptionMap[category.category]}
          </Typography>
        </Collapse>
      </Box>
    </Box>
  );
};

type ConsentProps = {
  handleAllowAll: () => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (category: string) => void;
  userCategoryPreference: CategoryWithoutServices[];
};

const Content = ({
  handleAllowAll,
  userCategoryPreference,
  handleChange,
}: ConsentProps) => {
  return (
    <Box>
      <Box sx={{ maxHeight: "440px", overflowY: "scroll", marginTop: "24px" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "18px",
              lineHeight: "28px",
              fontWeight: 600,
              color: "#181D27",
            }}
          >
            Privacy Preference Center
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: "18px",
              fontWeight: 400,
              color: "#535862",
              marginTop: "4px",
            }}
          >
            When you visit any website, it may store or retrieve information on
            your browser, mostly in the form of cookies. This information might
            be about you, your preferences or your device and is mostly used to
            make the site work as you expect it to. The information does not
            usually directly identify you, but it can give you a more
            personalized web experience. Because we respect your right to
            privacy, you can choose not to allow some types of cookies. Click on
            the different category headings to find out more and change our
            default settings. However, blocking some types of cookies may impact
            your experience of the site and the services we are able to offer.
          </Typography>

          <Box sx={{ marginTop: "16px" }}>
            <StyledButton
              variant="contained"
              fontColor="#ffffff"
              bgColor="#000000"
              onClick={handleAllowAll}
              sx={{
                width: "210px",
              }}
            >
              Allow all
            </StyledButton>
          </Box>

          <Stack
            sx={{
              marginTop: "20px",
            }}
            gap="12px"
          >
            {userCategoryPreference?.map((category, index) => (
              <CookieCategoryCard
                key={index}
                category={category}
                handleChange={handleChange}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

type FooterProps = {
  handleAllowNecessary: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSave: (userCategoryPreference: CategoryWithoutServices[]) => void;
  userCategoryPreference: CategoryWithoutServices[];
};

const Footer = ({
  handleAllowNecessary,
  handleSave,
  userCategoryPreference,
}: FooterProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap="12px"
      marginTop="24px"
    >
      <StyledButton
        variant="contained"
        fontColor="#000000"
        bgColor="#ffffff"
        onClick={handleAllowNecessary}
        sx={{ width: "210px" }}
      >
        Allow necessary
      </StyledButton>
      <StyledButton
        variant="contained"
        fontColor="#ffffff"
        bgColor="#000000"
        onClick={() => handleSave(userCategoryPreference)}
        sx={{ width: "210px" }}
      >
        Save settings
      </StyledButton>
    </Stack>
  );
};

type CookiePreferenceModalProps = {
  open: boolean;
  handleClose: () => void;
  handleAllowAll: () => void;
  handleAllowNecessary: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSave: (userCategoryPreference: CategoryWithoutServices[]) => void;
};

function CookiePreferenceModal({
  open,
  handleClose,
  handleAllowAll,
  handleAllowNecessary,
  handleSave,
}: CookiePreferenceModalProps) {
  const { consentState } = useCookieConsentContext();

  const [userCategoryPreference, setUserCategoryPreference] = useState(
    consentState?.categories
      ?.filter((category) => !category.hide)
      ?.map((category) => ({
        category: category.category,
        enabled: category.enabled,
        editable: category.editable,
        hide: category.hide,
      }))
  );

  const handleChange = (categoryName: string) => {
    setUserCategoryPreference((categories) =>
      categories.map((cat) =>
        cat.category === categoryName ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledContainer>
        <Header handleClose={handleClose} />
        <Content
          handleAllowAll={handleAllowAll}
          userCategoryPreference={userCategoryPreference}
          handleChange={handleChange}
        />
        <Footer
          handleAllowNecessary={handleAllowNecessary}
          handleSave={handleSave}
          userCategoryPreference={userCategoryPreference}
        />
      </StyledContainer>
    </Modal>
  );
}

export default CookiePreferenceModal;
