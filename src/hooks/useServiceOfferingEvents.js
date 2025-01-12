import { useQuery } from "@tanstack/react-query";
import {
  setEventIds,
  setEvents,
  setEventsLoadingStatus,
  setEventIdsLoadingStatus,
  setEventsServiceAndEnv,
  initialiseEvents,
} from "../slices/eventsSlice";
import { useDispatch } from "react-redux";
import loadingStatuses from "../utils/constants/loadingStatuses";
import { getAllEvents } from "../api/event";
import { useEffect } from "react";

function useServiceOfferingEvents(
  serviceId,
  serviceProviderId,
  serviceURLKey,
  serviceAPIVersion,
  serviceEnvironmentURLKey,
  serviceModelURLKey,
  productTierURLKey,
  resourceParameters = [],
  subscriptionId
) {
  const isQueryEnabled = Boolean(
    serviceId &&
      serviceProviderId &&
      serviceURLKey &&
      serviceAPIVersion &&
      serviceEnvironmentURLKey &&
      serviceModelURLKey &&
      productTierURLKey &&
      Array.isArray(resourceParameters) &&
      resourceParameters.length > 0 &&
      subscriptionId
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(initialiseEvents());
    };
  }, [dispatch]);

  const query = useQuery(
    [
      "events",
      serviceId,
      serviceEnvironmentURLKey,
      serviceProviderId,
      serviceAPIVersion,
      serviceModelURLKey,
      productTierURLKey,
      subscriptionId,
    ],
    async () => {
      dispatch(
        setEventsServiceAndEnv({
          serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
        })
      );

      dispatch(
        setEventsLoadingStatus({
          serviceId: serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
          status: loadingStatuses.loading,
        })
      );

      const eventsResponse = await getAllEvents(
        serviceProviderId,
        serviceURLKey,
        serviceAPIVersion,
        serviceEnvironmentURLKey,
        serviceModelURLKey,
        productTierURLKey,
        subscriptionId
      );

      const eventIds = eventsResponse.data.ids;
      const eventsArr = eventsResponse.data?.events;
      const events = {};
      eventsArr?.forEach((event) => {
        events[event.id] = event;
      });

      dispatch(
        setEventIds({
          serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
          eventIds,
        })
      );

      dispatch(
        setEventIdsLoadingStatus({
          serviceId: serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
          status: loadingStatuses.success,
        })
      );

      dispatch(
        setEvents({
          serviceId: serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
          events: events,
        })
      );
      dispatch(
        setEventsLoadingStatus({
          serviceId: serviceId,
          environmentURLKey: serviceEnvironmentURLKey,
          status: loadingStatuses.success,
        })
      );

      return events;
    },
    {
      enabled: isQueryEnabled,
      retry: false,
      refetchOnMount: true,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
      onError: () => {
        dispatch(
          setEventsLoadingStatus({
            serviceId: serviceId,
            environmentURLKey: serviceEnvironmentURLKey,
            status: loadingStatuses.error,
          })
        );
      },
    }
  );
  return query;
}

export default useServiceOfferingEvents;
