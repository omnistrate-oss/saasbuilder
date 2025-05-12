import CloseIcon from "@mui/icons-material/Close";

import { DisplayText, Text } from "src/components/Typography/Typography";
import { colors } from "src/themeConfig";

type FullScreenDrawerNavbarProps = {
  title?: string;
  description?: string;
  closeDrawer?: () => void;
};

const FullScreenDrawerNavbar: React.FC<FullScreenDrawerNavbarProps> = ({
  title,
  description,
  closeDrawer = () => {},
}) => {
  if (!title) {
    return null;
  }

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E9EAEB] sticky top-0 z-10">
      <div className="max-w-[84rem] py-2.5 px-4 mx-auto flex items-center justify-between gap-6">
        <div>
          <DisplayText
            data-testid="drawer-title"
            // @ts-ignore
            size="xsmall"
            weight="bold"
            color={colors.gray900}
            sx={{ mb: "4px" }}
          >
            {title}
          </DisplayText>
          {description && (
            <Text data-testid="drawer-description" size="medium" weight="regular" color="#535862">
              {description}
            </Text>
          )}
        </div>

        <button data-testid="close-button" className="flex items-center gap-1.5 p-1" onClick={closeDrawer}>
          <Text size="small" weight="semibold" color="#414651">
            Close
          </Text>

          <CloseIcon color="error" />
        </button>
      </div>
    </div>
  );
};

export default FullScreenDrawerNavbar;
