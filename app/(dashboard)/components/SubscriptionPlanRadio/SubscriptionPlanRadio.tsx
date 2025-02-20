"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowOutward } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import { useSelector } from "react-redux";
import { selectUserrootData } from "src/slices/userDataSlice";

const SubscriptionPlanCard = ({
  plan,
  subscriptions,
  subscriptionRequest,
  onSubscribeClick,
  isSelected,
  onClick,
  disabled,
  disabledMessage,
}) => {
  const rootSubscription = subscriptions.find((sub) => sub.roleType === "root");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const card = (
    <div
      className={clsx(
        "flex items-start justify-between gap-3 px-4 pt-4 pb-3 rounded-xl outline outline-[2px]",
        isSelected ? "outline-blue-700" : "outline-gray-300",
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
          className="text-blue-700 font-semibold text-sm"
        >
          Click here to view plan details <ArrowOutward />
        </Link>
      </div>
      {!rootSubscription && !subscriptionRequest && (
        <Button
          variant="contained"
          disabled={disabled || isSubscribing}
          startIcon={<CirclePlusIcon disabled={disabled || isSubscribing} />}
          onClick={async () => {
            try {
              setIsSubscribing(true);
              await onSubscribeClick();
            } catch (error) {
              console.error(error);
            } finally {
              setIsSubscribing(false);
            }
          }}
        >
          Subscribe
          {isSubscribing && <LoadingSpinnerSmall />}
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

  if (disabled && disabledMessage) {
    return (
      <Tooltip placement="top" title={disabledMessage}>
        {card}
      </Tooltip>
    );
  }

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
  const queryClient = useQueryClient();
  const selectUser = useSelector(selectUserrootData);
  const { subscriptions, subscriptionRequests } = useGlobalData();

  const servicePlanId = formData.values[name];

  const subscriptionRequestsObj: Record<string, SubscriptionRequest> =
    useMemo(() => {
      return subscriptionRequests
        ?.filter((el) => el.status === "PENDING")
        .reduce((acc, request) => {
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
      {servicePlans
        // When disabled, show only the Selected Service Plan. This is in case of Modify Instance
        .filter((el) => (disabled ? el.productTierID === servicePlanId : true))
        .map((plan) => (
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
              try {
                const res = await subscribeMutation.mutateAsync({
                  productTierId: plan.productTierID,
                  serviceId: plan.serviceId,
                  AutoApproveSubscription: plan.AutoApproveSubscription,
                });

                // @ts-ignore
                const id = Object.values(res?.data || {}).join("");

                if (id.startsWith("subr")) {
                  snackbar.showSuccess(
                    "Subscription Request sent successfully"
                  );

                  queryClient.setQueryData(
                    ["subscription-requests"],
                    (oldData: any) => {
                      return {
                        ...oldData,
                        data: {
                          ids: [...(oldData.data.ids || []), id],
                          subscriptionRequests: [
                            ...(oldData.data.subscriptionRequests || []),
                            {
                              id,
                              serviceId: plan.serviceId,
                              serviceName: plan.serviceName,
                              productTierId: plan.productTierID,
                              productTierName: plan.productTierName,
                              rootUserId: selectUser.id,
                              rootUserEmail: selectUser.email,
                              rootUserName: selectUser.name,
                              status: "PENDING",
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                              updatedByUserId: "",
                              updatedByUserName: "",
                            },
                          ],
                        },
                      };
                    }
                  );
                } else if (id.startsWith("sub")) {
                  formData.setFieldValue(name, plan.productTierID);
                  onChange(plan.productTierID, id);
                  snackbar.showSuccess("Subscribed successfully");

                  queryClient.setQueryData(
                    ["user-subscriptions"],
                    (oldData: any) => {
                      return {
                        ...oldData,
                        data: {
                          ids: [...(oldData.data.ids || []), id],
                          subscriptions: [
                            ...(oldData.data.subscriptions || []),
                            {
                              id,
                              rootUserId: selectUser.id,
                              serviceId: plan.serviceId,
                              productTierId: plan.productTierID,
                              serviceOrgId: plan.serviceOrgId,
                              serviceOrgName: plan.serviceProviderName,
                              roleType: "root",
                              createdAt: new Date().toISOString(),
                              subscriptionOwnerName: selectUser.name,
                              serviceName: plan.serviceName,
                              serviceLogoURL: plan.serviceLogoURL,
                              cloudProviderNames: plan.cloudProviders,
                              defaultSubscription: false,
                              productTierName: plan.productTierName,
                              accountConfigIdentityId: selectUser.orgId,
                              status: "ACTIVE",
                            },
                          ],
                        },
                      };
                    }
                  );
                }
              } catch (error) {
                console.error(error);
                snackbar.showError("Failed to subscribe. Please try again");
              }
            }}
            onClick={() => {
              if (servicePlanId !== plan.productTierID) {
                onChange(plan.productTierID);
              }
              formData.setFieldValue(name, plan.productTierID);
            }}
            isSelected={servicePlanId === plan.productTierID}
            disabled={disabled || plan.serviceModelStatus !== "READY"}
            disabledMessage={
              plan.serviceModelStatus !== "READY"
                ? "Service not available at the moment"
                : ""
            }
          />
        ))}
    </div>
  );
};

export default SubscriptionPlanRadio;
