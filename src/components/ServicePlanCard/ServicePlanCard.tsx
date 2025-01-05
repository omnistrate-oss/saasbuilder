import Image from "next/image";
import CardCircleBg from "./CardCircleBg.svg";
import ServicePlanCardIcon from "../Icons/ServicePlanCard/ServicePlanCardIcon";
import { Text } from "../Typography/Typography";
import Button from "../Button/Button";
import CirclePlusIcon from "../Icons/ServicePlanCard/CirclePlusIcon";
import CircleCheckIcon from "../Icons/ServicePlanCard/CircleCheckIcon";
import clsx from "clsx";
import { SetState } from "src/types/common/reactGenerics";

type ServicePlanCardProps = {
  isSelected?: boolean;
  servicePlan: any;
  subscriptionStatus: "subscribed" | "pending-approval" | "not-subscribed";
  setSelectedPlanId: SetState<string>;
};

const ServicePlanCard: React.FC<ServicePlanCardProps> = ({
  isSelected,
  servicePlan,
  subscriptionStatus,
  setSelectedPlanId,
}) => {
  return (
    <div
      onClick={() => setSelectedPlanId(servicePlan.productTierID)}
      className={clsx(
        "overflow-hidden relative flex flex-col gap-3 items-center border border-[#E9EAEB] rounded-xl px-4 py-4 cursor-pointer",
        isSelected && "outline-2 outline-[#0E5FB5]"
      )}
    >
      <Image
        src={CardCircleBg}
        alt=""
        className="absolute"
        style={{ top: "-50px", left: "-50px" }}
      />

      <ServicePlanCardIcon />

      <div>
        <Text
          size="large"
          weight="semibold"
          color="#414651"
          sx={{ textAlign: "center" }}
        >
          {servicePlan.productTierName}
        </Text>

        <Text
          size="small"
          weight="regular"
          color="#535862"
          sx={{ textAlign: "center" }}
        >
          {servicePlan.productTierDescription}
        </Text>
      </div>

      <Button
        variant="contained"
        disabled={subscriptionStatus === "subscribed"}
        startIcon={
          subscriptionStatus === "not-subscribed" ? (
            <CirclePlusIcon />
          ) : (
            <CircleCheckIcon />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
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
