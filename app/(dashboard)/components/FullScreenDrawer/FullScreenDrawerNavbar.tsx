import CloseIcon from "@mui/icons-material/Close";
import { DisplayText, Text } from "src/components/Typography/Typography";

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
    <div className="bg-[#FFFFFF] border-b border-[#E9EAEB]">
      <div className="max-w-[84rem] py-2.5 px-4 mx-auto flex items-center justify-between gap-6">
        <div>
          <DisplayText
            // @ts-ignore
            size="xsmall"
            weight="bold"
            color="#181D27"
            sx={{ mb: "4px" }}
          >
            {title}
          </DisplayText>
          {description && (
            <Text size="medium" weight="regular" color="#535862">
              {description}
            </Text>
          )}
        </div>

        <button
          className="flex items-center gap-1.5 p-1"
          onClick={closeDrawer}
          autoFocus
        >
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
