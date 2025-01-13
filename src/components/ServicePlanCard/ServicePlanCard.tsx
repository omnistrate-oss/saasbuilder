import Image from "next/image";

import Button from "../Button/Button";
import { Text } from "../Typography/Typography";
import StatusChip from "../StatusChip/StatusChip";
import ClockIcon from "../Icons/ServicePlanCard/ClockIcon";
import CirclePlusIcon from "../Icons/ServicePlanCard/CirclePlusIcon";
import CircleCheckIcon from "../Icons/ServicePlanCard/CircleCheckIcon";
import ServicePlanCardIcon from "../Icons/ServicePlanCard/ServicePlanCardIcon";

import { colors } from "src/themeConfig";
import { SetState } from "src/types/common/reactGenerics";

import CardCircleBg from "./CardCircleBg.svg";

type ServicePlanCardProps = {
  isSelected?: boolean;
  servicePlan: any;
  subscription: any;
  subscriptionRequest: any;
  setSelectedPlanId: SetState<string>;
  onSubscribeClick: () => void;
  onUnsubscribeClick: () => void;
  isSubscribing?: boolean;
  isUnsubscribing?: boolean;
  isFetchingData?: boolean;
};

const ServicePlanCard: React.FC<ServicePlanCardProps> = ({
  isSelected,
  servicePlan,
  subscription,
  subscriptionRequest,
  setSelectedPlanId,
  onSubscribeClick,
  onUnsubscribeClick,
  isSubscribing,
  isUnsubscribing,
  isFetchingData,
}) => {
  const isAutoApprove = servicePlan.AutoApproveSubscription;
  const isUnsubscribeAllowed =
    !subscription?.defaultSubscription && subscription?.roleType === "root";

  return (
    <div
      onClick={() => setSelectedPlanId(servicePlan.productTierID)}
      className="overflow-hidden relative flex flex-col gap-3 items-center border border-[#E9EAEB] rounded-xl px-4 py-4 cursor-pointer"
      style={{
        outline: isSelected ? `2px solid ${colors.purple700}` : "none",
      }}
    >
      <StatusChip
        sx={{
          position: "absolute",
          top: "20px",
          right: "12px",
        }}
        capitalize={false}
        color={isAutoApprove ? "#175CD3" : "#B93815"}
        bgColor={isAutoApprove ? "#EFF8FF" : "#FEF6EE"}
        borderColor={isAutoApprove ? "#B2DDFF" : "#F9DBAF"}
        status={isAutoApprove ? "Auto Approval" : "Approval Required"}
      />
      <Image
        src={CardCircleBg}
        alt=""
        className="absolute"
        style={{ top: "-50px", left: "-50px" }}
      />

      <ServicePlanCardIcon />

      <div style={{ maxWidth: "100%" }}>
        <Text
          size="large"
          weight="semibold"
          color="#414651"
          sx={{
            textAlign: "center",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {servicePlan.productTierName}
        </Text>

        <Text
          size="small"
          weight="regular"
          color="#535862"
          sx={{
            textAlign: "center",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {servicePlan.productTierDescription}
        </Text>
      </div>

      {!subscription && !subscriptionRequest && (
        <Button
          variant="contained"
          disabled={isFetchingData || isSubscribing || isUnsubscribing}
          startIcon={
            <CirclePlusIcon
              disabled={isFetchingData || isSubscribing || isUnsubscribing}
            />
          }
          onClick={onSubscribeClick}
        >
          Subscribe
        </Button>
      )}

      {subscription && isUnsubscribeAllowed && (
        <Button
          variant="contained"
          bgColor="#D92D20"
          disabled={isFetchingData || isSubscribing || isUnsubscribing}
          onClick={onUnsubscribeClick}
        >
          Unsubscribe
        </Button>
      )}

      {subscription && !isUnsubscribeAllowed && (
        <Button
          variant="contained"
          disabled
          startIcon={<CircleCheckIcon />}
          disabledMessage={
            subscription?.defaultSubscription
              ? "Cannot unsubscribe from Default subscription"
              : subscription && subscription?.roleType !== "root"
                ? "Cannot unsubscribe without Root access"
                : ""
          }
        >
          Subscribed
        </Button>
      )}

      {subscriptionRequest && !subscription && (
        <Button variant="contained" disabled startIcon={<ClockIcon />}>
          Pending Approval
        </Button>
      )}
    </div>
  );
};

export default ServicePlanCard;
