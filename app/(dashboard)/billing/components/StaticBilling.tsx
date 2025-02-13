import Button from "src/components/Button/Button";
import StatusChip from "src/components/StatusChip/StatusChip";
import { Text } from "src/components/Typography/Typography";
import { ArrowOutward } from "@mui/icons-material";
import BillingCard from "./BillingCard";
import InvoiceTable from "./InvoiceTable";
import SpeedometerIcon from "app/(dashboard)/components/Icons/SpeedometerIcon";
import WalletIcon from "app/(dashboard)/components/Icons/WalletIcon";

const SampleBilling = () => {
  // Number of hours from the start of the month
  const usageHours = Math.floor(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()) /
      (1000 * 3600)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between gap-3 p-5 rounded-xl shadow-[0_1px_2px_0_#1018280D] border border-[#E4E7EC] bg-white mb-8">
        <div>
          <Text
            size="medium"
            weight="semibold"
            color="#344054"
            sx={{ mb: "2px" }}
          >
            Payment Method
          </Text>
          <StatusChip status="Configured" category="success" />
        </div>

        <Button
          variant="outlined"
          disabled
          disabledMessage="Payment method already configured"
          endIcon={<ArrowOutward />}
        >
          Configure Payment Method
        </Button>
      </div>

      <Text size="large" weight="semibold" color="#101828" sx={{ mb: "12px" }}>
        Billing Information
      </Text>

      <div className="grid grid-cols-3 gap-2 rounded-lg p-4 border border-[#E4E7EC] bg-white mb-9">
        <div className="col-span-2 grid grid-cols-3 gap-y-2.5">
          <Text size="medium" weight="semibold" color="#344054">
            Current Enrollment
          </Text>
          <Text
            size="small"
            weight="regular"
            color="#475467"
            className="col-span-2"
          >
            Enterprise Tier
          </Text>
          <Text size="medium" weight="semibold" color="#344054">
            Preferred Currency
          </Text>
          <Text
            size="small"
            weight="regular"
            color="#475467"
            className="col-span-2"
          >
            US Dollar ($)
          </Text>
          <Text size="medium" weight="semibold" color="#344054">
            Billing Usage Reset
          </Text>
          <Text
            size="small"
            weight="regular"
            color="#475467"
            className="col-span-2"
          >
            {/* First of Next Month - Format (Mar 1, 2025) */}
            {new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            (in{" "}
            {
              // Number of Days
              Math.floor(
                (new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  1
                ).getTime() -
                  new Date().getTime()) /
                  (1000 * 3600 * 24)
              )
            }{" "}
            days)
          </Text>
          <Text size="medium" weight="semibold" color="#344054">
            Billing Address
          </Text>
          <Text
            size="small"
            weight="regular"
            color="#475467"
            className="col-span-2"
          >
            1234 Elm Street, Suite 562, San Francisco, CA 94105, United States
          </Text>
        </div>
        <BillingCard
          icon={<WalletIcon />}
          title="Current Credit Balance"
          value={
            <Text size="xlarge" weight="bold" color="#6941C6">
              $0.00
            </Text>
          }
        />
      </div>

      <Text size="large" weight="semibold" color="#101828" sx={{ mb: "12px" }}>
        Usage Tracking (Current Billing Cycle)
      </Text>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <BillingCard
          icon={<SpeedometerIcon />}
          title="Memory GB hours"
          value={
            <Text
              size="xlarge"
              weight="bold"
              color="#475467"
              sx={{ mt: "12px" }}
            >
              <span style={{ color: "#6941C6" }}>
                {usageHours * 8}
                {/* Assume that customer is using 2, 4 GB machines */}
              </span>{" "}
              Memory GB Hours
            </Text>
          }
        />
        <BillingCard
          icon={<SpeedometerIcon />}
          title="CPU core hours"
          value={
            <Text
              size="xlarge"
              weight="bold"
              color="#475467"
              sx={{ mt: "12px" }}
            >
              <span style={{ color: "#6941C6" }}>
                {usageHours * 4}
                {/* Assume that customer is using 2, 2 core machines */}
              </span>{" "}
              CPU Core Hours
            </Text>
          }
        />
      </div>

      <InvoiceTable />
    </div>
  );
};

export default SampleBilling;
