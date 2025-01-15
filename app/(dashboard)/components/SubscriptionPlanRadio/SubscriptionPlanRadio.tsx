"use client";

import clsx from "clsx";
import { useMemo } from "react";
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

const SubscriptionPlanCard = ({
  plan,
  subscriptions,
  subscriptionRequest,
  isSubscribing,
  onSubscribeClick,
  isSelected,
  isFetchingData,
  onClick,
}) => {
  const rootSubscription = subscriptions.find((sub) => sub.roleType === "root");
  const card = (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 px-4 py-4 rounded-xl outline outline-[2px]",
        isSelected ? "outline-purple-600" : "outline-gray-300",
        !subscriptions.length && "bg-gray-50"
      )}
      style={{
        cursor: subscriptions.length ? "pointer" : "default",
      }}
      onClick={() => {
        if (subscriptions.length) {
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
          className="line-clamp-2"
        >
          {plan.productTierDescription}
        </Text>
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

      {subscriptionRequest && !subscriptions.length && (
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

  if (subscriptionRequest) {
    return (
      <Tooltip placement="top" title="Subscription request is pending approval">
        {card}
      </Tooltip>
    );
  }

  return card;
};

const SubscriptionPlanRadio = ({
  servicePlans,
  name,
  formData,
  onChange = () => {},
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptions,
    subscriptionRequests,
    refetchSubscriptions,
    refetchSubscriptionRequests,
  } = useGlobalData();

  const servicePlanId = formData.values[name];

  const subscriptionRequestsObj: Record<string, SubscriptionRequest> =
    useMemo(() => {
      return subscriptionRequests?.reduce((acc, request) => {
        acc[request.productTierId] = request;
        return acc;
      }, {});
    }, [subscriptionRequests]);

  const subscribeMutation = useMutation(
    (payload: any) => {
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
    },
    {
      onSuccess: (res: any) => {
        const id = Object.values(res.data || {}).join("");
        refetchSubscriptions();
        refetchSubscriptionRequests();
        if (id.startsWith("subr")) {
          snackbar.showSuccess("Subscription Request sent successfully");
        } else {
          snackbar.showSuccess("Subscribed successfully");
        }
      },
    }
  );

  if (!servicePlans.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {servicePlans.map((plan: any) => (
        <SubscriptionPlanCard
          key={plan.productTierID}
          plan={plan}
          subscriptions={subscriptions.filter(
            (sub) => sub.productTierId === plan.productTierID
          )}
          subscriptionRequest={subscriptionRequestsObj[plan.productTierID]}
          onSubscribeClick={() =>
            subscribeMutation.mutate({
              productTierId: plan.productTierID,
              serviceId: plan.serviceId,
              AutoApproveSubscription: plan.AutoApproveSubscription,
            })
          }
          onClick={() => {
            if (servicePlanId !== plan.productTierID) {
              // @ts-ignore
              onChange(plan.productTierID);
            }
            formData.setFieldValue(name, plan.productTierID);
          }}
          isSubscribing={subscribeMutation.isLoading}
          isSelected={servicePlanId === plan.productTierID}
          isFetchingData={false}
        />
      ))}
    </div>
  );
};

export default SubscriptionPlanRadio;
