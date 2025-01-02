import { FC, ReactNode, useMemo } from "react";
import Select from "../FormElementsv2/Select/Select";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import MenuItem from "../FormElementsv2/MenuItem/MenuItem";
import { SelectChangeEvent, Stack } from "@mui/material";
import { useRouter } from "next/router";
import SubscriptionTypeDirectIcon from "../Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import { Text } from "../Typography/Typography";
import { Subscription } from "src/types/subscription";
import Chip from "../Chip/Chip";
import SubscriptionTypeInvitedIcon from "../Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import Tooltip from "../Tooltip/Tooltip";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import { sidebarActiveOptions } from "../MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import {
  getAPIDocsRoute,
  getAccessControlRoute,
  getAuditLogsRoute,
  getDashboardRoute,
  getNotificationsRoute,
  getResourceInstancesRoute,
} from "src/utils/route/access/accessRoute";
import { getBillingRoute } from "src/utils/route/billing";
import { getSettingsRoute } from "src/utils/route/settings";
import { getSubscriptionsRoute } from "src/utils/route/subscriptions";
import DOMPurify from "isomorphic-dompurify";

type SubscriptionDropdownProps = {
  serviceId: string;
  subscriptionId: string;
  pageType: string;
};

const SubscriptionsDropdown: FC<SubscriptionDropdownProps> = (props) => {
  const { serviceId, subscriptionId, pageType } = props;
  const router = useRouter();
  const { environmentId } = router.query;

  const environmentType = useEnvironmentType();
  const subscriptionsQuery = useUserSubscriptions(
    {
      serviceId: serviceId,
      environmentType,
    },
    {
      refetchOnMount: false,
      enabled: Boolean(serviceId && environmentType),
    }
  );

  const subscriptions: Subscription[] = useMemo(
    () => subscriptionsQuery.data || [],
    [subscriptionsQuery.data]
  );
  const isLoadingSubscriptions = subscriptionsQuery.isLoading;

  const selectedSubscription: Subscription | undefined = useMemo(
    () =>
      subscriptions.find((subscription) => subscription.id === subscriptionId),
    [subscriptionId, subscriptions]
  );

  function handleChange(e: SelectChangeEvent) {
    const newSubscriptionId = DOMPurify.sanitize(e.target.value);
    const subscription = subscriptions.find(
      (subscription) => subscription.id === newSubscriptionId
    );

    if (!subscription) return;
    const productTierId = subscription.productTierId;
    let newRoute = "";
    if (pageType === sidebarActiveOptions.accessControl) {
      newRoute = getAccessControlRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.apiDocument) {
      newRoute = getAPIDocsRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.auditLogs) {
      newRoute = getAuditLogsRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.billing) {
      newRoute = getBillingRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.dashboard) {
      newRoute = getDashboardRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.instancesList) {
      newRoute = getResourceInstancesRoute(
        serviceId,
        environmentId,
        productTierId,
        "",
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.notifications) {
      newRoute = getNotificationsRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.settings) {
      newRoute = getSettingsRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    } else if (pageType === sidebarActiveOptions.subscriptions) {
      newRoute = getSubscriptionsRoute(
        serviceId,
        environmentId,
        productTierId,
        newSubscriptionId
      );
    }

    router.push(newRoute);
  }

  return (
    <Select
      displayEmpty={true}
      disabled={isLoadingSubscriptions}
      value={subscriptionId || ""}
      onChange={handleChange}
      MenuProps={{
        PaperProps: {
          sx: {
            maxWidth: 247, // Set the max width for the menu
            padding: "11px 0px",
            borderRadius: "8px",
          },
        },
      }}
      renderValue={() => {
        if (isLoadingSubscriptions) {
          return (
            <Stack justifyContent="center" alignItems="center" mt="3px">
              <LoadingSpinnerSmall />
            </Stack>
          );
        }

        let subscriptionIcon: ReactNode = null;
        if (selectedSubscription) {
          if (selectedSubscription.roleType === "root") {
            subscriptionIcon = (
              <SubscriptionTypeDirectIcon
                style={{ flexShrink: 0 }}
                height={20}
                width={20}
              />
            );
          } else {
            subscriptionIcon = (
              <SubscriptionTypeInvitedIcon
                style={{ flexShrink: 0 }}
                height={20}
                width={20}
              />
            );
          }
        }
        return (
          <Stack direction="row" alignItems="center" gap="3px">
            {subscriptionIcon}

            <Text
              size="medium"
              weight="medium"
              color="#101828"
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {selectedSubscription?.productTierName}
            </Text>
          </Stack>
        );
      }}
    >
      {subscriptions.map((subscription) => {
        const SubscriptionTypeIcon =
          subscription.roleType === "root"
            ? SubscriptionTypeDirectIcon
            : SubscriptionTypeInvitedIcon;

        return (
          <MenuItem
            value={subscription.id}
            key={subscription.id}
            sx={{
              "& + &": {
                marginTop: "0px",
              },
              padding: "5px 12px",
            }}
          >
            <Tooltip
              title={subscription?.productTierName}
              placement="right"
              sx={{ marginLeft: "4px" }}
            >
              <Stack
                direction="row"
                alignItems="flexStart"
                gap="3px"
                width="100%"
              >
                <SubscriptionTypeIcon
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  height={20}
                  width={20}
                />
                <Stack alignItems="flex-start" gap="6px">
                  <Text
                    size="small"
                    weight="medium"
                    color="#101828"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "199px",
                    }}
                  >
                    {subscription?.productTierName}
                  </Text>
                  <Chip
                    label={subscription.id}
                    fontColor="#067647"
                    bgColor="#ECFDF3"
                    borderColor="#ABEFC6"
                    size="small"
                  />
                </Stack>
              </Stack>
            </Tooltip>
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default SubscriptionsDropdown;
