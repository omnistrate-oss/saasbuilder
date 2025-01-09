import { useSelector } from "react-redux";
import { selectDrawerExpandedState } from "../../slices/dashboardSideDrawerSlice";
import { Stack } from "@mui/material";
import { apiDocsUrl } from "../../utils/constants";
import useDownloadCLI from "../../hooks/useDownloadCLI";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import NavItem, {
  NonLinkListItem,
  ListItemText,
  MenuHoverTooltip,
  MenuHoverTooltipTitle,
} from "./NavItem";
import { List } from "./NavList";
import { tabs } from "../Tab/MarketplaceServiceDefinitionsTab";
import { selectUserrootData } from "../../slices/userDataSlice";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../utils/isAllowedByRBAC";
import SupportIcon from "../Icons/SideNavbar/Support/SupportIcon";
import APIDocsIcon from "../Icons/SideNavbar/APIDocs/APIDocsIcon";
import PricingIcon from "../Icons/SideNavbar/Pricing/PricingIcon";
import DownloadCLIIcon from "../Icons/SideNavbar/DownloadCLI/DownloadCLIIcon";
import DeveloperDocsIcon from "../Icons/SideNavbar/DeveloperDocs/DeveloperDocsIcon";
import BillingPlansIcon from "../Icons/SideNavbar/BillingPlans/BillingPlans";
import { getMarketplaceProductTierRoute } from "src/utils/route/access/accessRoute";
import { sidebarActiveOptions } from "../MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import { useState } from "react";
import { useRouter } from "next/router";
import SideDrawerRight from "../SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "../Access/AccessSupport";

const MarketplaceStaticNavList = (props) => {
  const isNavDrawerExpanded = useSelector(selectDrawerExpandedState);

  const {
    // servicePlanUrlLink,
    serviceId,
    serviceApiId,
    apiDocs,
    isActive,
    subscriptionId,
    environmentId,
    activePage,
  } = props;
  const router = useRouter();
  const { productTierId } = router.query;
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const { data: service, isFetching: isFetchingData } = useServiceOffering(
    serviceId,
    productTierId
  );
  const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(selectUser.roleType);
  const view = viewEnum.AccessService;
  const readAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Read,
    role,
    view
  );
  const isServicePlansActive = activePage === sidebarActiveOptions.servicePlans;
  const servicePlansLink = getMarketplaceProductTierRoute(
    serviceId,
    environmentId
  );

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
    setCurrentTabValue(null);
  };

  const navItems = [
    {
      name: "Subscription Plans",
      IconComponent: BillingPlansIcon,
      href: servicePlansLink,
      isActive: isServicePlansActive,
    },
    {
      name: "API Documentation",
      IconComponent: APIDocsIcon,
      activeRoutes: [],
      alt: "api-docs",
      href: apiDocs ? apiDocs : apiDocsUrl,
      disabled: apiDocs ? false : true,
      newTab: apiDocs ? false : true,
      isActive: isActive,
    },
    {
      name: "Download CLI",
      activeRoutes: [],
      alt: `cli`,
      href: "https://github.com/omnistrate/cli/releases/tag/v0.2",
      disabled: false,
      newTab: false,
      RenderUI: () => {
        const { downloadCLI, isDownloading } = useDownloadCLI();

        function handleDownloadClick() {
          if (!isDownloading) {
            downloadCLI(serviceId, serviceApiId, subscriptionId);
          }
        }
        return (
          <MenuHoverTooltip
            title={<MenuHoverTooltipTitle>Download CLI</MenuHoverTooltipTitle>}
            isVisible={!isNavDrawerExpanded}
          >
            <NonLinkListItem
              active={false}
              key="download-cli"
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              <Stack direction="row" alignItems="center">
                <DownloadCLIIcon active={false} />
                <ListItemText visible={isNavDrawerExpanded}>
                  Download CLI{" "}
                  {isDownloading && (
                    <LoadingSpinnerSmall sx={{ marginLeft: "24px" }} />
                  )}
                </ListItemText>
              </Stack>
            </NonLinkListItem>
          </MenuHoverTooltip>
        );
      },
    },
    {
      name: "Support",
      activeRoutes: [],
      alt: "support",
      href: "",
      disabled: !readAccessServiceAllowed,
      newTab: false,
      RenderUI: () => {
        function handleSupportClick() {
          setSupportDrawerOpen(true);
          setCurrentTabValue(tabs.support);
        }
        return (
          <MenuHoverTooltip
            title={<MenuHoverTooltipTitle>Support</MenuHoverTooltipTitle>}
            isVisible={!isNavDrawerExpanded}
          >
            <NonLinkListItem
              active={currentTabValue === tabs.support}
              onClick={handleSupportClick}
              clickDisabled={isFetchingData || !readAccessServiceAllowed}
            >
              <Stack direction="row" alignItems="center">
                <SupportIcon />
                <ListItemText visible={isNavDrawerExpanded}>
                  Support{" "}
                </ListItemText>
              </Stack>
            </NonLinkListItem>
          </MenuHoverTooltip>
        );
      },
    },
    {
      name: "Pricing",
      activeRoutes: [],
      alt: `pricing`,
      disabled: !readAccessServiceAllowed,
      newTab: false,
      RenderUI: () => {
        function handlePricingIconClick() {
          setSupportDrawerOpen(true);
          setCurrentTabValue(tabs.pricing);
        }
        return (
          <MenuHoverTooltip
            title={<MenuHoverTooltipTitle>Pricing</MenuHoverTooltipTitle>}
            isVisible={!isNavDrawerExpanded}
          >
            <NonLinkListItem
              active={currentTabValue === tabs.pricing}
              key=""
              onClick={handlePricingIconClick}
              clickDisabled={isFetchingData || !readAccessServiceAllowed}
            >
              <Stack direction="row" alignItems="center">
                <PricingIcon />
                <ListItemText visible={isNavDrawerExpanded}>
                  Pricing{" "}
                </ListItemText>
              </Stack>
            </NonLinkListItem>
          </MenuHoverTooltip>
        );
      },
    },
    {
      name: "Documentation",
      activeRoutes: [],
      alt: `dev-docs`,
      disabled: !readAccessServiceAllowed,
      newTab: false,
      RenderUI: () => {
        function handleDocumentationIconClick() {
          setSupportDrawerOpen(true);
          setCurrentTabValue(tabs.documentation);
        }
        return (
          <MenuHoverTooltip
            title={<MenuHoverTooltipTitle>Documentation</MenuHoverTooltipTitle>}
            isVisible={!isNavDrawerExpanded}
          >
            <NonLinkListItem
              active={currentTabValue === tabs.documentation}
              key=""
              onClick={handleDocumentationIconClick}
              clickDisabled={isFetchingData || !readAccessServiceAllowed}
            >
              <Stack direction="row" alignItems="center">
                <DeveloperDocsIcon />
                <ListItemText visible={isNavDrawerExpanded}>
                  Documentation{" "}
                </ListItemText>
              </Stack>
            </NonLinkListItem>
          </MenuHoverTooltip>
        );
      },
    },
  ];

  return (
    <>
      <List open={isNavDrawerExpanded}>
        {navItems.map((navItem) => {
          const {
            name,
            icon,
            // alt,
            isActive,
            // activeRoutes = [],
            href,
            disabled,
            IconComponent,
            subItems = [],
            newTab,
            RenderUI,
          } = navItem;

          const isNavItemActive = isActive ? true : false;

          if (RenderUI) {
            return <RenderUI key={name} />;
          }

          return (
            <NavItem
              isActive={isNavItemActive}
              IconComponent={IconComponent}
              key={name}
              name={name}
              href={href}
              iconSrc={icon}
              subItems={subItems}
              disabled={disabled}
              openInNewTab={newTab}
            />
          );
        })}
      </List>
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport service={service} currentTabValue={currentTabValue} />
        }
      />
    </>
  );
};

export default MarketplaceStaticNavList;
