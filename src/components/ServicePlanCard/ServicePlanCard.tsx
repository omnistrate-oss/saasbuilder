import Image from "next/image";
import Button from "../Button/Button";
import { Text } from "../Typography/Typography";
import CirclePlusIcon from "../Icons/ServicePlanCard/CirclePlusIcon";
import CircleCheckIcon from "../Icons/ServicePlanCard/CircleCheckIcon";
import ServicePlanCardIcon from "../Icons/ServicePlanCard/ServicePlanCardIcon";

import { SetState } from "src/types/common/reactGenerics";
import CardCircleBg from "./CardCircleBg.svg";

type ServicePlanCardProps = {
  isSelected?: boolean;
  servicePlan: any;
  subscriptionStatus: "subscribed" | "pending-approval" | "not-subscribed";
  setSelectedPlanId: SetState<string>;
  onSubscribeClick: () => void;
  isSubscribing?: boolean;
  isFetchingData?: boolean;
};

const ServicePlanCard: React.FC<ServicePlanCardProps> = ({
  isSelected,
  servicePlan,
  subscriptionStatus,
  setSelectedPlanId,
  onSubscribeClick,
  isSubscribing,
  isFetchingData,
}) => {
  const isDisabled =
    subscriptionStatus === "subscribed" ||
    subscriptionStatus === "pending-approval" ||
    isSubscribing ||
    isFetchingData;

  return (
    <div
      onClick={() => setSelectedPlanId(servicePlan.productTierID)}
      className="overflow-hidden relative flex flex-col gap-3 items-center border border-[#E9EAEB] rounded-xl px-4 py-4 cursor-pointer"
      style={{
        outline: isSelected ? "2px solid #0E5FB5" : "none",
      }}
    >
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

      <Button
        variant="contained"
        disabled={isDisabled}
        startIcon={
          subscriptionStatus === "not-subscribed" ? (
            <CirclePlusIcon disabled={isDisabled} />
          ) : (
            <CircleCheckIcon disabled={isDisabled} />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          onSubscribeClick();
        }}
      >
        {subscriptionStatus === "subscribed"
          ? "Subscribed"
          : subscriptionStatus === "pending-approval"
            ? "Pending Approval"
            : "Subscribe"}
      </Button>
    </div>
  );
};

export default ServicePlanCard;
