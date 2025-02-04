"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowOutward } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";

import Button from "components/Button/Button";
import Tooltip from "components/Tooltip/Tooltip";
import { Text } from "components/Typography/Typography";
import ClockIcon from "components/Icons/ServicePlanCard/ClockIcon";
import CirclePlusIcon from "components/Icons/ServicePlanCard/CirclePlusIcon";
import CircleCheckIcon from "components/Icons/ServicePlanCard/CircleCheckIcon";

import { colors } from "src/themeConfig";
import useSnackbar from "src/hooks/useSnackbar";
import { createSubscriptions } from "src/api/subscriptions";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { SubscriptionRequest } from "src/types/subscriptionRequest";
import { createSubscriptionRequest } from "src/api/subscriptionRequests";
import { getSubscriptionsRoute } from "src/utils/routes";
import { ServiceOffering } from "src/types/serviceOffering";

const SubscriptionPlanCard = ({
  plan,
  subscriptions,
  subscriptionRequest,
  isSubscribing,
  onSubscribeClick,
  isSelected,
  isFetchingData,
  onClick,
  disabled,
  disabledMessage,
}) => {
  const rootSubscription = subscriptions.find((sub) => sub.roleType === "root");
  const card = (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 px-4 pt-4 pb-3 rounded-xl outline outline-[2px]",
        isSelected ? "outline-success-500" : "outline-gray-300",
        (!subscriptions.length || disabled) && "bg-gray-50"
      )}
      style={{
        cursor: subscriptions.length && !disabled ? "pointer" : "default",
      }}
      onClick={() => {
        if (subscriptions.length && !disabled) {
          onClick();
        }
      }}
    >
      <div>
        <Text
          size="small"
          weight="semibold"
          color={colors.gray700}
          className="line-clamp-2"
        >
          {plan.productTierName}
        </Text>
        <Text
          size="small"
          weight="regular"
          color={colors.gray600}
          className="line-clamp-2 mb-1"
        >
          {plan.productTierDescription}
        </Text>
        <Link
          href={getSubscriptionsRoute({
            serviceId: plan.serviceId,
            servicePlanId: plan.productTierID,
          })}
          target="_blank"
          className="text-purple-700 font-semibold text-sm"
        >
          Click here to view plan details <ArrowOutward />
        </Link>
      </div>
      {!rootSubscription && !subscriptionRequest && (
        <Button
          variant="contained"
          disabled={isFetchingData || isSubscribing}
          startIcon={
            <CirclePlusIcon disabled={isFetchingData || isSubscribing} />
          }
          onClick={onSubscribeClick}
        >
          Subscribe
        </Button>
      )}

      {rootSubscription && (
        <Button
          variant="contained"
          disabled
          startIcon={<CircleCheckIcon />}
          bgColor={colors.gray100}
          outlineColor={colors.gray200}
          fontColor={colors.gray400}
        >
          Subscribed
        </Button>
      )}

      {subscriptionRequest && !rootSubscription && (
        <Button
          variant="contained"
          disabled
          startIcon={<ClockIcon />}
          bgColor={colors.gray100}
          outlineColor={colors.gray200}
          fontColor={colors.gray400}
        >
          Pending Approval
        </Button>
      )}
    </div>
  );

  if (!subscriptions.length && !subscriptionRequest) {
    return (
      <Tooltip
        placement="top"
        title="Subscribe to this plan before you can use it"
      >
        {card}
      </Tooltip>
    );
  }

  if (!subscriptions.length && subscriptionRequest) {
    return (
      <Tooltip placement="top" title="Subscription request is pending approval">
        {card}
      </Tooltip>
    );
  }

  if (disabled && disabledMessage) {
    return (
      <Tooltip placement="top" title={disabledMessage}>
        {card}
      </Tooltip>
    );
  }

  return card;
};

type SubscriptionPlanRadioProps = {
  servicePlans: ServiceOffering[];
  formData: any;
  name: string;
  onChange?: (servicePlanId?: string, subscriptionId?: string) => void;
  disabled?: boolean;
};

const SubscriptionPlanRadio: React.FC<SubscriptionPlanRadioProps> = ({
  servicePlans,
  name,
  formData,
  onChange = () => {},
  disabled,
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptions,
    subscriptionRequests,
    refetchSubscriptions,
    refetchSubscriptionRequests,
    isFetchingSubscriptions,
    isFetchingSubscriptionRequests,
  } = useGlobalData();

  const servicePlanId = formData.values[name];

  const subscriptionRequestsObj: Record<string, SubscriptionRequest> =
    useMemo(() => {
      return subscriptionRequests?.reduce((acc, request) => {
        acc[request.productTierId] = request;
        return acc;
      }, {});
    }, [subscriptionRequests]);

  const subscribeMutation = useMutation((payload: any) => {
    if (payload.AutoApproveSubscription) {
      return createSubscriptions({
        productTierId: payload.productTierId,
        serviceId: payload.serviceId,
      });
    } else {
      return createSubscriptionRequest({
        productTierId: payload.productTierId,
        serviceId: payload.serviceId,
      });
    }
  });

  if (!servicePlans.length) {
    return (
      <div className="flex items-center justify-center h-10">
        <Text size="small" weight="medium" color={colors.gray500}>
          No service plans found
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servicePlans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.productTierID}
          plan={plan}
          subscriptions={subscriptions.filter(
            (sub) =>
              sub.productTierId === plan.productTierID &&
              ["root", "editor"].includes(sub.roleType)
          )}
          subscriptionRequest={subscriptionRequestsObj[plan.productTierID]}
          onSubscribeClick={async () => {
            const res = await subscribeMutation.mutateAsync({
              productTierId: plan.productTierID,
              serviceId: plan.serviceId,
              AutoApproveSubscription: plan.AutoApproveSubscription,
            });

            // @ts-ignore
            const id = Object.values(res?.data || {}).join("");

            if (id.startsWith("subr")) {
              snackbar.showSuccess("Subscription Request sent successfully");
            } else if (id.startsWith("sub")) {
              formData.setFieldValue(name, plan.productTierID);
              onChange(plan.productTierID, id);
              snackbar.showSuccess("Subscribed successfully");
            }

            refetchSubscriptions();
            refetchSubscriptionRequests();
          }}
          onClick={() => {
            if (servicePlanId !== plan.productTierID) {
              onChange(plan.productTierID);
            }
            formData.setFieldValue(name, plan.productTierID);
          }}
          isSubscribing={subscribeMutation.isLoading}
          isSelected={servicePlanId === plan.productTierID}
          isFetchingData={
            isFetchingSubscriptions || isFetchingSubscriptionRequests
          }
          disabled={disabled || plan.serviceModelStatus !== "READY"}
          disabledMessage={
            plan.serviceModelStatus !== "READY"
              ? "Service model is not active"
              : ""
          }
        />
      ))}
    </div>
  );
};

export default SubscriptionPlanRadio;
