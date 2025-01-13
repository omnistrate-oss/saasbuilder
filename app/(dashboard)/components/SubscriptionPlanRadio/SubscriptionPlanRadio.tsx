"use client";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { createSubscriptionRequest } from "src/api/subscriptionRequests";
import { createSubscriptions } from "src/api/subscriptions";
import Button from "src/components/Button/Button";
import CircleCheckIcon from "src/components/Icons/ServicePlanCard/CircleCheckIcon";
import CirclePlusIcon from "src/components/Icons/ServicePlanCard/CirclePlusIcon";
import ClockIcon from "src/components/Icons/ServicePlanCard/ClockIcon";
import { Text } from "src/components/Typography/Typography";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { colors } from "src/themeConfig";

const SubscriptionPlanCard = ({
  plan,
  subscription,
  subscriptionRequest,
  isSubscribing,
  onSubscribeClick,
  isSelected,
  isFetchingData,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 px-4 py-4 rounded-xl cursor-pointer outline outline-[2px]",
        isSelected ? "outline-purple-600" : "outline-gray-300"
      )}
      onClick={onClick}
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
      {!subscription && !subscriptionRequest && (
        <Button
          variant="contained"
          disabled={isFetchingData || isSubscribing}
          startIcon={
            <CirclePlusIcon disabled={isFetchingData || isSubscribing} />
          }
          onClick={onSubscribeClick}
        >
          Subsribe
        </Button>
      )}

      {subscription && (
        <Button variant="contained" disabled startIcon={<CircleCheckIcon />}>
          Subscribed
        </Button>
      )}

      {subscriptionRequest && (
        <Button variant="contained" disabled startIcon={<ClockIcon />}>
          Pending Approval
        </Button>
      )}
    </div>
  );
};

const SubscriptionPlanRadio = ({
  serviceId,
  servicePlanId,
  name,
  formData,
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptions,
    subscriptionRequests,
    serviceOfferingsObj,
    refetchSubscriptions,
    refetchSubscriptionRequests,
  } = useGlobalData();

  const servicePlans = useMemo(() => {
    return Object.values(serviceOfferingsObj[serviceId] || {});
  }, [serviceId, serviceOfferingsObj]);

  const subscriptionsObj = useMemo(() => {
    return subscriptions?.reduce((acc, subscription) => {
      if (subscription.roleType === "root")
        acc[subscription.productTierId] = subscription;
      return acc;
    }, {});
  }, [subscriptions]);

  const subscriptionRequestsObj = useMemo(() => {
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
          subscription={subscriptionsObj[plan.productTierID]}
          subscriptionRequest={subscriptionRequestsObj[plan.productTierID]}
          onSubscribeClick={() =>
            subscribeMutation.mutate({
              productTierId: plan.productTierID,
              serviceId: plan.serviceId,
              AutoApproveSubscription: plan.AutoApproveSubscription,
            })
          }
          onClick={() => {
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
