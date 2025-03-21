import { styled, Tooltip, tooltipClasses } from "@mui/material";
import { useMemo } from "react";
import { Text } from "src/components/Typography/Typography";
import { UpgradeStatus } from "src/types/resourceInstance";
import formatDateUTC from "src/utils/formatDateUTC";

type StatusCellProps = {
  upcomingUpgrade?: any;
};

const statusMap: Record<UpgradeStatus, string> = {
  IN_PROGRESS: "In Progress",
  CANCELLED: "Cancelled",
  COMPLETE: "Complete",
  FAILED: "Failed",
  PAUSED: "Paused",
  PENDING: "Pending",
  SCHEDULED: "Scheduled",
};

const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip
    placement="bottom-start"
    classes={{ popper: className }}
    {...props}
  />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "374px",
    backgroundColor: "#FFFFFF",
    padding: "0px",
    border: "1px solid #D0D5DD",
    boxShadow: "0 4px 6px -2px #10182808, 0 12px 16px -4px #10182814",
    borderRadius: "8px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#FFFFFF",
  },
});

const BellIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CalendarIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M14 6.66659H2M10.6667 1.33325V3.99992M5.33333 1.33325V3.99992M5.2 14.6666H10.8C11.9201 14.6666 12.4802 14.6666 12.908 14.4486C13.2843 14.2569 13.5903 13.9509 13.782 13.5746C14 13.1467 14 12.5867 14 11.4666V5.86659C14 4.74648 14 4.18643 13.782 3.7586C13.5903 3.38228 13.2843 3.07632 12.908 2.88457C12.4802 2.66659 11.9201 2.66659 10.8 2.66659H5.2C4.0799 2.66659 3.51984 2.66659 3.09202 2.88457C2.71569 3.07632 2.40973 3.38228 2.21799 3.7586C2 4.18643 2 4.74648 2 5.86659V11.4666C2 12.5867 2 13.1467 2.21799 13.5746C2.40973 13.9509 2.71569 14.2569 3.09202 14.4486C3.51984 14.6666 4.0799 14.6666 5.2 14.6666Z"
        stroke="#717680"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type Notification = {
  label: string;
  value: React.ReactNode;
};

const TooltipContent = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <div className="p-3">
      <div className="flex items-center gap-1.5 pb-1.5 border-b border-[#E9EAEB]">
        <BellIcon color="#414651" />
        <Text size="small" weight="semibold" color="#344054">
          Notifications
        </Text>
      </div>

      <div className="pt-3.5 p-1.5">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-center gap-3">
            <Text size="xsmall" weight="medium" color="#181D27">
              {notification.label}
            </Text>
            <Text size="small" weight="regular" color="#535862">
              :
            </Text>
            {notification.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusCell: React.FC<StatusCellProps> = ({ upcomingUpgrade }) => {
  const notifications = useMemo(() => {
    const res: Notification[] = [];

    if (upcomingUpgrade?.upgrade_path_scheduled_at) {
      res.push({
        label: "Upcoming Upgrade",
        value: (
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <Text size="xsmall" weight="regular" color="#181D27" ellipsis>
              {formatDateUTC(upcomingUpgrade.upgrade_path_scheduled_at)}
            </Text>
          </div>
        ),
      });
    } else if (upcomingUpgrade?.upgrade_instance_status) {
      res.push({
        label: "Upgrade Status",
        value: (
          <Text size="xsmall" weight="regular" color="#181D27">
            {statusMap[upcomingUpgrade.upgrade_instance_status] ||
              upcomingUpgrade.upgrade_instance_status}
          </Text>
        ),
      });
    }

    return res;
  }, [upcomingUpgrade]);

  const icon = (
    <BellIcon color={notifications.length ? "#414651" : "#D5D7DA"} />
  );

  if (notifications.length > 0) {
    return (
      <StyledTooltip title={<TooltipContent notifications={notifications} />}>
        <span>{icon}</span>
      </StyledTooltip>
    );
  }

  return icon;
};

export default StatusCell;
