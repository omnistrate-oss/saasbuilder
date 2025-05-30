"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { createSubscriptionRequest } from "src/api/subscriptionRequests";
import { createSubscriptions, deleteSubscription } from "src/api/subscriptions";
import useSnackbar from "src/hooks/useSnackbar";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { selectUserrootData } from "src/slices/userDataSlice";
import { Subscription } from "src/types/subscription";
import CardWithTitle from "components/Card/CardWithTitle";
import FieldDescription from "components/FormElementsv2/FieldDescription/FieldDescription";
import FieldTitle from "components/FormElementsv2/FieldTitle/FieldTitle";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import Select from "components/FormElementsv2/Select/Select";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import ServicePlanCard from "components/ServicePlanCard/ServicePlanCard";
import ServicePlanDetails from "components/ServicePlanDetails/ServicePlanDetails";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

const ManageSubscriptionsForm = ({ defaultServiceId, defaultServicePlanId, isFetchingServiceOfferings }) => {
  const {
    serviceOfferings,
    serviceOfferingsObj,
    subscriptions,
    subscriptionRequests,
    isFetchingSubscriptions,
    isFetchingSubscriptionRequests,
  } = useGlobalData();

  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const selectUser = useSelector(selectUserrootData);
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [subscriptionIdToDelete, setSubscriptionIdToDelete] = useState<string | undefined>("");

  const services = useMemo(() => {
    const servicesObj = serviceOfferings?.reduce((acc, offering) => {
      acc[offering.serviceId] = offering;
      return acc;
    }, {});

    return Object.values(servicesObj || {}).sort((a, b) =>
      // @ts-ignore
      a?.serviceName.localeCompare(b?.serviceName)
    );
  }, [serviceOfferings]);

  const [selectedServiceId, setSelectedServiceId] = useState<any>(
    defaultServiceId || serviceOfferings[0]?.serviceId || ""
  );

  // Plans for the Selected Service
  const servicePlans = useMemo(() => {
    return Object.values(serviceOfferingsObj[selectedServiceId] || {}).sort((a, b) =>
      a?.productTierName.localeCompare(b?.productTierName)
    );
  }, [selectedServiceId, serviceOfferingsObj]);

  const [selectedPlanId, setSelectedPlanId] = useState<any>(
    // @ts-ignore
    defaultServicePlanId || services[0]?.productTierID || ""
  );

  // Object of Root Subscriptions and Subscription Requests
  const subscriptionsObj = useMemo(() => {
    return subscriptions?.reduce((acc, subscription) => {
      if (subscription.roleType === "root") acc[subscription.productTierId] = subscription;
      return acc;
    }, {});
  }, [subscriptions]);

  const subscriptionRequestsObj = useMemo(() => {
    return subscriptionRequests
      ?.filter((el) => el.status === "PENDING")
      .reduce((acc, request) => {
        acc[request.productTierId] = request;
        return acc;
      }, {});
  }, [subscriptionRequests]);

  const subscribeMutation = useMutation({
    mutationFn: (payload: any) => {
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
  });

  const unSubscribeMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.setQueryData(["user-subscriptions"], (oldData: any) => {
        return {
          ...oldData,
          data: {
            ids: oldData.data.ids.filter((id: string) => id !== subscriptionIdToDelete),
            subscriptions: oldData.data.subscriptions.filter((sub: Subscription) => sub.id !== subscriptionIdToDelete),
          },
        };
      });
      setIsUnsubscribeDialogOpen(false);
      snackbar.showSuccess("Unsubscribed successfully");
    },
    onSettled: () => {
      setSubscriptionIdToDelete(undefined);
    },
  });

  useEffect(() => {
    const planIds = Object.keys(serviceOfferingsObj[selectedServiceId] || {});
    if (planIds.length && !planIds.includes(selectedPlanId)) {
      setSelectedPlanId(planIds[0]);
    }
  }, [selectedServiceId, serviceOfferingsObj, selectedPlanId]);

  const selectedPlan = serviceOfferingsObj[selectedServiceId]?.[selectedPlanId];

  if (isFetchingServiceOfferings || isFetchingSubscriptions || isFetchingSubscriptionRequests) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <CardWithTitle title="Standard Information">
        <div className="grid grid-cols-5">
          <div>
            <FieldTitle required>Product Name</FieldTitle>
            <FieldDescription>Select SaaS Product</FieldDescription>
          </div>
          <div className="col-span-4">
            <Select value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)} sx={{ mt: 0 }}>
              {services.map((service: any) => (
                <MenuItem key={service.serviceId} value={service.serviceId}>
                  {service.serviceName}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </CardWithTitle>

      <CardWithTitle title="List of Plans">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {servicePlans.map((plan: any) => (
            <ServicePlanCard
              key={plan.productTierID}
              servicePlan={plan}
              isSelected={selectedPlanId === plan.productTierID}
              setSelectedPlanId={setSelectedPlanId}
              rootSubscription={subscriptionsObj[plan.productTierID]}
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
                    snackbar.showSuccess("Subscription Request sent successfully");

                    queryClient.setQueryData(["subscription-requests"], (oldData: any) => {
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
                    });
                  } else if (id.startsWith("sub")) {
                    snackbar.showSuccess("Subscribed successfully");

                    queryClient.setQueryData(["user-subscriptions"], (oldData: any) => {
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
                    });
                  }
                } catch (error) {
                  console.error(error);
                  snackbar.showError("Failed to subscribe. Please try again");
                }
              }}
              onUnsubscribeClick={() => {
                setIsUnsubscribeDialogOpen(true);
              }}
            />
          ))}
        </div>
      </CardWithTitle>

      <ServicePlanDetails serviceOffering={selectedPlan} />

      <TextConfirmationDialog
        open={isUnsubscribeDialogOpen}
        handleClose={() => setIsUnsubscribeDialogOpen(false)}
        onConfirm={async () => {
          if (!subscriptionsObj[selectedPlanId]) {
            return snackbar.showError("Please select a plan");
          }
          setSubscriptionIdToDelete(subscriptionsObj[selectedPlanId].id);
          await unSubscribeMutation.mutateAsync(subscriptionsObj[selectedPlanId].id);
        }}
        confirmationText="unsubscribe"
        title="Unsubscribe SaaS Product"
        buttonLabel="Unsubscribe"
        isLoading={unSubscribeMutation.isPending}
        subtitle={`Are you sure you want to unsubscribe from ${subscriptionsObj[selectedPlanId]?.serviceName}?`}
        message="To confirm, please enter <b>unsubscribe</b>, in the field below:"
      />
    </div>
  );
};

export default ManageSubscriptionsForm;
