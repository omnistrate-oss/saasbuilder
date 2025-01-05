"use client";

import { useEffect, useMemo, useState } from "react";
import CardWithTitle from "src/components/Card/CardWithTitle";
import FieldDescription from "src/components/FormElementsv2/FieldDescription/FieldDescription";
import FieldTitle from "src/components/FormElementsv2/FieldTitle/FieldTitle";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";
import Select from "src/components/FormElementsv2/Select/Select";
import ServicePlanCard from "src/components/ServicePlanCard/ServicePlanCard";
import ServicePlanDetails from "src/components/ServicePlanDetails/ServicePlanDetails";
import { useGlobalDataContext } from "src/providers/GlobalDataProvider";

const ManageSubscriptionsForm = () => {
  const {
    serviceOfferings,
    serviceOfferingsObj,
    subscriptions,
    subscriptionRequests,
  } = useGlobalDataContext();

  const services = useMemo(() => {
    const servicesObj = serviceOfferings?.reduce((acc, offering) => {
      acc[offering.serviceId] = offering;
      return acc;
    }, {});

    return Object.values(servicesObj || {});
  }, [serviceOfferings]);

  const [selectedServiceId, setSelectedServiceId] = useState<any>(
    serviceOfferings[0]?.serviceId || ""
  );

  const servicePlans = useMemo(() => {
    return Object.values(serviceOfferingsObj[selectedServiceId] || {});
  }, [selectedServiceId, serviceOfferingsObj]);

  const [selectedPlanId, setSelectedPlanId] = useState<any>(
    services[0]?.productTierID || ""
  );

  useEffect(() => {
    const planIds = Object.keys(serviceOfferingsObj[selectedServiceId]);
    if (planIds.length) {
      setSelectedPlanId(planIds[0]);
    }
  }, [selectedServiceId, serviceOfferingsObj]);

  const selectedPlan = serviceOfferingsObj[selectedServiceId]?.[selectedPlanId];

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
        <div className="grid grid-cols-3 gap-3">
          {servicePlans.map((plan: any) => (
            <ServicePlanCard
              key={plan.productTierID}
              servicePlan={plan}
              isSelected={selectedPlanId === plan.productTierID}
              setSelectedPlanId={setSelectedPlanId}
            />
          ))}
        </div>
      </CardWithTitle>

      <CardWithTitle title={selectedPlan?.productTierName}>
        <ServicePlanDetails
          planDetails={selectedPlan?.productTierPlanDescription}
          documentation={selectedPlan?.productTierDocumentation}
          pricing={selectedPlan?.productTierPricing.value}
          support={selectedPlan?.productTierSupport}
        />
      </CardWithTitle>
    </div>
  );
};

export default ManageSubscriptionsForm;
