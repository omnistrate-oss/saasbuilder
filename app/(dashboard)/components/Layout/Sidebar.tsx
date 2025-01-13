"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Collapse } from "@mui/material";
import { usePathname } from "next/navigation";

import { Text } from "components/Typography/Typography";
import ShieldIcon from "components/Icons/SideNavbar/Shield/Shield";
import APIDocsIcon from "components/Icons/SideNavbar/APIDocs/APIDocsIcon";
import SupportIcon from "components/Icons/SideNavbar/Support/SupportIcon";
import PricingIcon from "components/Icons/SideNavbar/Pricing/PricingIcon";
import ResourcesIcon from "components/Icons/SideNavbar/Resources/Resources";
import DashboardNavIcon from "components/Icons/SideNavbar/Dashboard/Dashboard";
import DownloadCLIIcon from "components/Icons/SideNavbar/DownloadCLI/DownloadCLIIcon";
import DeveloperDocsIcon from "components/Icons/SideNavbar/DeveloperDocs/DeveloperDocsIcon";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { colors } from "src/themeConfig";
import useBillingDetails from "src/hooks/query/useBillingDetails";

const bottomItems = [
  {
    name: "API Documentation",
    icon: APIDocsIcon,
    href: "/api-documentation",
  },
  {
    name: "Download CLI",
    icon: DownloadCLIIcon,
  },
  {
    name: "Support",
    icon: SupportIcon,
  },
  {
    name: "Pricing",
    icon: PricingIcon,
  },
  {
    name: "Documentation",
    icon: DeveloperDocsIcon,
  },
];

const SingleNavItem = ({
  name,
  icon: Icon,
  href,
  currentPath,
  // onClick,
}: {
  name: string;
  icon: any;
  href?: string;
  currentPath: string | null;
  onClick?: () => void;
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-2.5 py-2.5 px-3 rounded-md group cursor-pointer hover:bg-gray-50 transition-colors mb-1"
      >
        <Icon />

        <Text
          size="medium"
          weight="semibold"
          color={currentPath === href ? colors.success500 : colors.gray700}
          className="group-hover:text-success-500 transition-colors"
        >
          {name}
        </Text>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2.5 py-2.5 px-3 rounded-md group cursor-pointer hover:bg-gray-50 transition-colors mb-1">
      <Icon />

      <Text
        size="medium"
        weight="semibold"
        className="group-hover:text-success-500 transition-colors"
      >
        {name}
      </Text>
    </div>
  );
};

const ExpandibleNavItem = ({ name, icon: Icon, subItems, currentPath }) => {
  const [isExpanded, setIsExpanded] = useState(
    subItems.some((item) => currentPath.includes(item.href))
  );

  return (
    <div>
      <div
        className="flex items-center gap-2.5 py-2.5 px-3 rounded-md group cursor-pointer hover:bg-gray-50 transition-colors mb-1"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Icon />

        <Text
          size="medium"
          weight="semibold"
          className="group-hover:text-success-500 transition-colors select-none"
        >
          {name}
        </Text>

        <div className="ml-auto">
          <ExpandLessIcon
            sx={{ color: colors.gray400 }}
            className={`transition-all ${isExpanded ? "rotate-0" : "rotate-180"}`}
          />
        </div>
      </div>

      <Collapse in={isExpanded}>
        {subItems.map((item) =>
          item.isHidden ? null : (
            <Link
              href={item.href}
              key={item.name}
              className={clsx(
                "flex items-center gap-2.5 py-2.5 px-3 pl-10 rounded-md group cursor-pointer hover:bg-gray-50 transition-colors mb- select-none",
                currentPath === item.href && "bg-gray-50"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <Text
                size="medium"
                weight="semibold"
                color={
                  currentPath === item.href ? colors.success500 : colors.gray700
                }
                className="group-hover:text-success-500 transition-colors"
              >
                {item.name}
              </Text>
            </Link>
          )
        )}
      </Collapse>
    </div>
  );
};

const Sidebar = () => {
  const currentPath = usePathname();

  // Prefetch Billing Data
  const billingDetailsQuery = useBillingDetails();
  const isBillingEnabled = Boolean(
    billingDetailsQuery.isFetched && billingDetailsQuery.data
  );

  const topItems = useMemo(() => {
    return [
      {
        name: "Dashboard",
        icon: DashboardNavIcon,
        href: "/dashboard",
      },
      {
        name: "Deployments",
        icon: ResourcesIcon,
        isExpandible: true,
        subItems: [
          { name: "Instances", href: "/instances" },
          { name: "Custom Networks", href: "/custom-networks" },
          { name: "Cloud Accounts", href: "/cloud-accounts" },
        ],
      },
      {
        name: "Security Controls",
        icon: ShieldIcon,
        isExpandible: true,
        subItems: [
          { name: "Access Control", href: "/access-control" },
          { name: "Audit Logs", href: "/audit-logs" },
          { name: "Notifications", href: "/notifications" },
        ],
      },
      {
        name: "Account Management",
        icon: ShieldIcon,
        isExpandible: true,
        subItems: [
          { name: "Settings", href: "/settings" },
          { name: "Billing", href: "/billing", isHidden: !isBillingEnabled },
          { name: "Subscriptions", href: "/subscriptions" },
        ],
      },
    ];
  }, [isBillingEnabled]);

  return (
    <aside
      className="absolute left-0 top-0 bottom-0 overflow-auto flex flex-col justify-between gap-12 px-4 py-5 border-r border-[#E9EAEB] shadow-[0_1px_2px_0_#0A0D120D] bg-white w-[19rem]"
      style={{
        // Hide scrollbar
        scrollbarWidth: "none",
      }}
    >
      <div>
        {topItems.map((item) =>
          item.subItems ? (
            <ExpandibleNavItem
              key={item.name}
              currentPath={currentPath}
              {...item}
            />
          ) : (
            <SingleNavItem
              key={item.name}
              currentPath={currentPath}
              {...item}
            />
          )
        )}
      </div>
      <div>
        {bottomItems.map((item) => (
          <SingleNavItem key={item.name} currentPath={currentPath} {...item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
