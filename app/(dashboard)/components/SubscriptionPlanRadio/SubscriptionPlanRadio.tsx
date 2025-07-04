"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowOutward } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { isSubscriptionValid } from "app/(dashboard)/instances/utils";
import clsx from "clsx";

import { $api } from "src/api/query";
import { getSubscriptionRequest } from "src/api/subscriptionRequests";
import { getSubscription } from "src/api/subscriptions";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import AlertTriangle from "src/components/Icons/AlertTriangle/AlertTriangle";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { colors } from "src/themeConfig";
import { ResourceInstance } from "src/types/resourceInstance";
import { ServiceOffering } from "src/types/serviceOffering";
import { Subscription } from "src/types/subscription";
import { SubscriptionRequest } from "src/types/subscriptionRequest";
import { getSubscriptionsRoute } from "src/utils/routes";
import Button from "components/Button/Button";
import CircleCheckIcon from "components/Icons/ServicePlanCard/CircleCheckIcon";
import CirclePlusIcon from "components/Icons/ServicePlanCard/CirclePlusIcon";
import ClockIcon from "components/Icons/ServicePlanCard/ClockIcon";
import Tooltip from "components/Tooltip/Tooltip";
import { Text } from "components/Typography/Typography";

const SubscriptionPlanCard = ({
  plan,
  subscriptions,
  subscriptionRequest,
  onSubscribeClick,
  isSelected,
  onClick,
  disabled,
  disabledMessage,
  isPlanSelectionDisabled,
  disabledReasonText,
}) => {
  const rootSubscription = subscriptions.find((sub) => sub.roleType === "root");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const card = (
    <div
      data-testid="subscription-plan-card"
      className={clsx(
        "gap-3 px-4 pt-4 pb-3 rounded-xl outline outline-[2px]",
        isSelected ? "outline-success-500" : "outline-gray-300",
        (!subscriptions.length || disabled || isPlanSelectionDisabled) && "bg-gray-50"
      )}
      style={{
        cursor: subscriptions.length && !isPlanSelectionDisabled ? "pointer" : "default",
      }}
      onClick={() => {
        if (subscriptions.length && !isPlanSelectionDisabled) {
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Text size="small" weight="semibold" color={colors.gray700} className="line-clamp-2">
            {plan.productTierName}
          </Text>
          <Text size="small" weight="regular" color={colors.gray600} className="line-clamp-2 mb-1">
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
            data-testid="subscribe-button"
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

      {disabledReasonText && (
        <div className="mt-2 mb-1 flex items-center gap-2">
          <AlertTriangle height="15px" width="15px" color="#DC6803" style={{ flexShrink: 0 }} />
          <Text weight="medium" size="xsmall" color="#DC6803">
            {disabledReasonText}
          </Text>
        </div>
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
      <Tooltip placement="top" title="Subscribe to this plan before you can use it">
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
  serviceSubscriptions: Subscription[];
  formData: any;
  name: string;
  onChange?: (servicePlanId?: string, subscriptionId?: string) => void;
  disabled?: boolean;
  instances: ResourceInstance[];
  subscriptionInstancesNumHash: Record<string, number>;
};

const SubscriptionPlanRadio: React.FC<SubscriptionPlanRadioProps> = ({
  servicePlans,
  serviceSubscriptions,
  name,
  formData,
  onChange = () => {},
  disabled,
  instances,
  subscriptionInstancesNumHash,
}) => {
  const environmentType = useEnvironmentType();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const { subscriptions, subscriptionRequests, serviceOfferingsObj } = useGlobalData();

  const servicePlanId = formData.values[name];

  const subscriptionRequestsObj: Record<string, SubscriptionRequest> = useMemo(() => {
    return subscriptionRequests
      ?.filter((el) => el.status === "PENDING")
      .reduce((acc, request) => {
        acc[request.productTierId] = request;
        return acc;
      }, {});
  }, [subscriptionRequests]);

  const createSubscriptionMutation = $api.useMutation("post", "/2022-09-01-00/subscription");
  const createSubscriptionRequestMutation = $api.useMutation("post", "/2022-09-01-00/subscription/request");

  const subscriptionInstanceCountHash: Record<string, number> = useMemo(() => {
    const res: Record<string, number> = {};
    instances.forEach((instance) => {
      if (instance.subscriptionId) {
        res[instance.subscriptionId] = (res[instance.subscriptionId] || 0) + 1;
      }
    });
    return res;
  }, [instances]);

  if (!servicePlans.length) {
    return (
      <div className="flex items-center justify-center h-10">
        <Text size="small" weight="medium" color={colors.gray500}>
          No plans found
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servicePlans
        // When disabled, show only the Selected Service Plan. This is in case of Modify Instance
        .filter((el) => (disabled ? el.productTierID === servicePlanId : true))
        .map((plan) => {
          const subscriptionForPlan = serviceSubscriptions.filter((el) => el.productTierId === plan.productTierID);
          const editorAndRootSubscriptions = subscriptionForPlan.filter((subscription) =>
            ["root", "editor"].includes(subscription.roleType)
          );

          const isPlanBlocked = editorAndRootSubscriptions.every((subscription) => {
            const limit = subscription.maxNumberOfInstances ?? plan.maxNumberOfInstances ?? Infinity;
            const isPaymentIssue =
              !subscription.paymentMethodConfigured &&
              !(subscription.allowCreatesWhenPaymentNotConfigured ?? plan.allowCreatesWhenPaymentNotConfigured);
            return (subscriptionInstanceCountHash[subscription.id] ?? 0) >= limit || isPaymentIssue;
          });

          let servicePlanDisabledText: ReactNode = "";

          if (editorAndRootSubscriptions.length && isPlanBlocked) {
            servicePlanDisabledText = "No usable subscriptions available for this plan";
          }

          return (
            <Box key={plan.productTierID} id="plan-card-container">
              <SubscriptionPlanCard
                key={plan.productTierID}
                plan={plan}
                subscriptions={subscriptions.filter(
                  (sub) => sub.productTierId === plan.productTierID && ["root", "editor"].includes(sub.roleType)
                )}
                subscriptionRequest={subscriptionRequestsObj[plan.productTierID]}
                onSubscribeClick={async () => {
                  try {
                    let res;
                    if (plan.AutoApproveSubscription) {
                      res = await createSubscriptionMutation.mutateAsync({
                        body: {
                          productTierId: plan.productTierID,
                          serviceId: plan.serviceId,
                        },
                      });
                    } else {
                      res = await createSubscriptionRequestMutation.mutateAsync({
                        body: {
                          productTierId: plan.productTierID,
                          serviceId: plan.serviceId,
                        },
                      });
                    }

                    // @ts-ignore
                    const id = Object.values(res?.data || {}).join("");

                    if (id.startsWith("subr")) {
                      snackbar.showSuccess("Subscription Request sent successfully");
                      const subscriptionRequst: SubscriptionRequest = (await getSubscriptionRequest(id)).data;

                      queryClient.setQueryData(["get", "/2022-09-01-00/subscription/request", {}], (oldData: any) => {
                        return {
                          subscriptionRequests: [...(oldData.subscriptionRequests || []), subscriptionRequst],
                        };
                      });
                    } else if (id.startsWith("sub")) {
                      snackbar.showSuccess("Subscribed successfully");
                      const subscription: Subscription = (await getSubscription(id)).data;
                      console.log("New subscription created:", subscription);

                      queryClient.setQueryData(
                        [
                          "get",
                          "/2022-09-01-00/subscription",
                          {
                            params: { query: { environmentType } },
                          },
                        ],
                        (oldData: any) => {
                          return {
                            subscriptions: [...(oldData.subscriptions || []), subscription],
                          };
                        }
                      );

                      formData.setFieldValue(name, plan.productTierID);
                      if (isSubscriptionValid(subscription, serviceOfferingsObj, subscriptionInstancesNumHash)) {
                        onChange(plan.productTierID, id);
                      }
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
                disabledMessage={plan.serviceModelStatus !== "READY" ? "Product not available at the moment" : ""}
                isPlanSelectionDisabled={disabled || plan.serviceModelStatus !== "READY"}
                disabledReasonText={servicePlanDisabledText}
              />
            </Box>
          );
        })}
    </div>
  );
};

export default SubscriptionPlanRadio;
