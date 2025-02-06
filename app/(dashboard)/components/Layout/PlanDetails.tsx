"use client";

import {
  getServiceMenuItems,
  getServicePlanMenuItems,
} from "app/(dashboard)/instances/utils";
import { useEffect, useMemo, useState } from "react";

import CardWithTitle from "components/Card/CardWithTitle";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import FieldLabel from "components/FormElements/FieldLabel/FieldLabel";
import ServicePlanDetails from "components/ServicePlanDetails/ServicePlanDetails";
import FieldDescription from "components/FormElementsv2/FieldDescription/FieldDescription";

import { useGlobalData } from "src/providers/GlobalDataProvider";

const PlanDetails = ({ startingTab }) => {
  const { serviceOfferings, serviceOfferingsObj, isFetchingServiceOfferings } =
    useGlobalData();

  const serviceMenuItems = useMemo(
    () => getServiceMenuItems(serviceOfferings),
    [serviceOfferings]
  );

  const [selectedServiceId, setSelectedServiceId] = useState(
    serviceOfferings?.[0]?.serviceId || ""
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    serviceOfferings?.[0]?.productTierID || ""
  );

  const servicePlanMenuItems = useMemo(
    () => getServicePlanMenuItems(serviceOfferings, selectedServiceId),
    [serviceOfferings, selectedServiceId]
  );

  useEffect(() => {
    if (!selectedServiceId) {
      setSelectedServiceId(serviceOfferings?.[0]?.serviceId || "");
    }

    const planIds = getServicePlanMenuItems(
      serviceOfferings,
      selectedServiceId || serviceOfferings?.[0]?.serviceId || ""
    )?.map((el) => el.value as string);

    if (planIds?.length && !planIds?.includes(selectedPlanId)) {
      setSelectedPlanId(planIds[0]);
    }
  }, [
    serviceOfferings,
    selectedServiceId,
    serviceOfferingsObj,
    selectedPlanId,
  ]);

  const selectedPlan = serviceOfferingsObj[selectedServiceId]?.[selectedPlanId];

  if (isFetchingServiceOfferings) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <CardWithTitle title="Standard Information">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex items-center gap-8 justify-between flex-1">
            <div className="min-w-[200px]">
              <FieldLabel required sx={{ color: "#414651", fontWeight: "600" }}>
                Service Name
              </FieldLabel>
              <FieldDescription sx={{ mt: 0, color: "#535862" }}>
                Select the service
              </FieldDescription>
            </div>

            <Select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              sx={{ mt: 0 }}
            >
              {serviceMenuItems?.length ? (
                serviceMenuItems.map((item) => (
                  <MenuItem
                    key={item.value as string}
                    value={item.value as string}
                  >
                    {item.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  <i>No services found</i>
                </MenuItem>
              )}
            </Select>
          </div>

          <div className="flex items-center gap-8 justify-between flex-1">
            <div className="min-w-[200px]">
              <FieldLabel required sx={{ color: "#414651", fontWeight: "600" }}>
                Subscription Plan
              </FieldLabel>
              <FieldDescription sx={{ mt: 0, color: "#535862" }}>
                Select the subscription plan
              </FieldDescription>
            </div>

            <Select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              sx={{ mt: 0 }}
            >
              {servicePlanMenuItems?.length ? (
                servicePlanMenuItems.map((item) => (
                  <MenuItem
                    key={item.value as string}
                    value={item.value as string}
                  >
                    {item.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  <i>No subscription plans found</i>
                </MenuItem>
              )}
            </Select>
          </div>
        </div>
      </CardWithTitle>

      <ServicePlanDetails
        serviceOffering={selectedPlan}
        startingTab={startingTab}
      />
    </div>
  );
};

export default PlanDetails;
