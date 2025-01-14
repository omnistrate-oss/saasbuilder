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
  subscription,
  subscriptionRequest,
  isSubscribing,
  onSubscribeClick,
  isSelected,
  isFetchingData,
  onClick,
}) => {
  const card = (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 px-4 py-4 rounded-xl outline outline-[2px]",
        isSelected ? "outline-purple-600" : "outline-gray-300",
        !subscription && "bg-gray-50"
      )}
      style={{
        cursor: subscription ? "pointer" : "default",
      }}
      onClick={() => {
        if (subscription) {
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
      {!subscription && !subscriptionRequest && (
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

      {subscription && (
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

      {subscriptionRequest && !subscription && (
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

  if (!subscription && !subscriptionRequest) {
    return (
      <Tooltip
        placement="top"
        title="Subscribe to this plan before you can use it"
      >
        {card}
      </Tooltip>
    );
  }

  return card;
};

const SubscriptionPlanRadio = ({
  serviceId,
  servicePlanId,
  name,
  formData,
}) => {
  const snackbar = useSnackbar();
  const {
    subscriptionsObj,
    subscriptionRequests,
    serviceOfferingsObj,
    refetchSubscriptions,
    refetchSubscriptionRequests,
  } = useGlobalData();

  const servicePlans = useMemo(() => {
    return Object.values(serviceOfferingsObj[serviceId] || {}).sort(
      (a: any, b: any) => a.productTierName.localeCompare(b.productTierName)
    );
  }, [serviceId, serviceOfferingsObj]);

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
