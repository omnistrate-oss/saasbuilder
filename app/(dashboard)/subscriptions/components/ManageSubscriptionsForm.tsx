"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import CardWithTitle from "components/Card/CardWithTitle";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import FieldTitle from "components/FormElementsv2/FieldTitle/FieldTitle";
import ServicePlanCard from "components/ServicePlanCard/ServicePlanCard";
import ServicePlanDetails from "components/ServicePlanDetails/ServicePlanDetails";
import FieldDescription from "components/FormElementsv2/FieldDescription/FieldDescription";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";

import useSnackbar from "src/hooks/useSnackbar";
import { createSubscriptions, deleteSubscription } from "src/api/subscriptions";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { createSubscriptionRequest } from "src/api/subscriptionRequests";

const ManageSubscriptionsForm = ({
  defaultServiceId,
  defaultServicePlanId,
  isFetchingServiceOfferings,
}) => {
  const {
    serviceOfferings,
    serviceOfferingsObj,
    subscriptions,
    subscriptionRequests,
    refetchSubscriptions,
    refetchSubscriptionRequests,
    isFetchingSubscriptions,
    isFetchingSubscriptionRequests,
  } = useGlobalData();

  const snackbar = useSnackbar();
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);

  const services = useMemo(() => {
    const servicesObj = serviceOfferings?.reduce((acc, offering) => {
      acc[offering.serviceId] = offering;
      return acc;
    }, {});

    return Object.values(servicesObj || {});
  }, [serviceOfferings]);

  const [selectedServiceId, setSelectedServiceId] = useState<any>(
    defaultServiceId || serviceOfferings[0]?.serviceId || ""
  );

  // Plans for the Selected Service
  const servicePlans = useMemo(() => {
    return Object.values(serviceOfferingsObj[selectedServiceId] || {});
  }, [selectedServiceId, serviceOfferingsObj]);

  const [selectedPlanId, setSelectedPlanId] = useState<any>(
    // @ts-ignore
    defaultServicePlanId || services[0]?.productTierID || ""
  );

  // Object of Root Subscriptions and Subscription Requests
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

  const unSubscribeMutation = useMutation(deleteSubscription, {
    onSuccess: () => {
      refetchSubscriptions();
      setIsUnsubscribeDialogOpen(false);
      snackbar.showSuccess("Unsubscribed successfully");
    },
  });

  useEffect(() => {
    const planIds = Object.keys(serviceOfferingsObj[selectedServiceId] || {});
    if (planIds.length && !planIds.includes(selectedPlanId)) {
      setSelectedPlanId(planIds[0]);
    }
  }, [selectedServiceId, serviceOfferingsObj, selectedPlanId]);

  const selectedPlan = serviceOfferingsObj[selectedServiceId]?.[selectedPlanId];

  if (isFetchingServiceOfferings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <CardWithTitle title="Standard Information">
        <div className="grid grid-cols-5">
          <div>
            <FieldTitle required>Service Name</FieldTitle>
            <FieldDescription>Select Service</FieldDescription>
          </div>
          <div className="col-span-4">
            <Select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              sx={{ mt: 0 }}
            >
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
              onSubscribeClick={() => {
                subscribeMutation.mutate({
                  productTierId: plan.productTierID,
                  serviceId: plan.serviceId,
                  AutoApproveSubscription: plan.AutoApproveSubscription,
                });
              }}
              onUnsubscribeClick={() => {
                setIsUnsubscribeDialogOpen(true);
              }}
              isSubscribing={subscribeMutation.isLoading}
              isFetchingData={
                isFetchingSubscriptions || isFetchingSubscriptionRequests
              }
              isUnsubscribing={unSubscribeMutation.isLoading}
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
          await unSubscribeMutation.mutateAsync(
            subscriptionsObj[selectedPlanId].id
          );
        }}
        confirmationText="unsubscribe"
        title="Unsubscribe Service"
        buttonLabel="Unsubscribe"
        isLoading={unSubscribeMutation.isLoading}
        subtitle={`Are you sure you want to unsubscribe from ${subscriptionsObj[selectedPlanId]?.serviceName}?`}
        message="To confirm, please enter <b>unsubscribe</b>, in the field below:"
      />
    </div>
  );
};

export default ManageSubscriptionsForm;
