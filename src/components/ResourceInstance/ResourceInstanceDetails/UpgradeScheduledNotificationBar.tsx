import { Text } from "src/components/Typography/Typography";
import { UpgradeStatus } from "src/types/resourceInstance";

const BellIcon = () => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dii_1448_34187)">
        <path
          d="M2 9C2 4.58172 5.58172 1 10 1H34C38.4183 1 42 4.58172 42 9V33C42 37.4183 38.4183 41 34 41H10C5.58172 41 2 37.4183 2 33V9Z"
          fill="white"
        />
        <path
          d="M2.5 9C2.5 4.85786 5.85786 1.5 10 1.5H34C38.1421 1.5 41.5 4.85786 41.5 9V33C41.5 37.1421 38.1421 40.5 34 40.5H10C5.85786 40.5 2.5 37.1421 2.5 33V9Z"
          stroke="#E9EAEB"
        />
        <path
          d="M19.3542 30C20.0593 30.6224 20.9856 31 22 31C23.0145 31 23.9407 30.6224 24.6458 30M28 17C28 15.4087 27.3679 13.8826 26.2427 12.7574C25.1174 11.6321 23.5913 11 22 11C20.4087 11 18.8826 11.6321 17.7574 12.7574C16.6322 13.8826 16 15.4087 16 17C16 20.0902 15.2205 22.206 14.3497 23.6054C13.6151 24.7859 13.2479 25.3761 13.2613 25.5408C13.2763 25.7231 13.3149 25.7926 13.4618 25.9016C13.5945 26 14.1926 26 15.3889 26H28.6112C29.8074 26 30.4056 26 30.5382 25.9016C30.6852 25.7926 30.7238 25.7231 30.7387 25.5408C30.7522 25.3761 30.3849 24.7859 29.6504 23.6054C28.7795 22.206 28 20.0902 28 17Z"
          stroke="#535862"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_dii_1448_34187"
          x="0"
          y="0"
          width="44"
          height="44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1448_34187"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1448_34187"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1448_34187"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect3_innerShadow_1448_34187"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_1448_34187"
            result="effect3_innerShadow_1448_34187"
          />
        </filter>
      </defs>
    </svg>
  );
};

const UpgradeScheduledNotificationBar = ({
  upgradeDate,
  upgradeStatus,
}: {
  upgradeDate: string;
  upgradeStatus: UpgradeStatus;
}) => {
  return (
    <div
      className="rounded-xl border border-warning-200 shadow-[0_1px_2px_0_#0A0D120D] overflow-hidden flex items-center gap-4 p-4"
      style={{ marginBottom: "20px", backgroundColor: "#FFFAEB" }}
    >
      <BellIcon />

      <Text size="small" weight="semibold" color="#414651">
        {upgradeDate
          ? `This deployment is scheduled for an upgrade on ${new Date(
              upgradeDate
            ).toLocaleString("en-GB", {
              timeZone: "UTC",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })} UTC`
          : upgradeStatus === "IN_PROGRESS"
            ? "This deployment is currently being upgraded"
            : "This deployment is scheduled for an upgrade"}
      </Text>
    </div>
  );
};

export default UpgradeScheduledNotificationBar;
