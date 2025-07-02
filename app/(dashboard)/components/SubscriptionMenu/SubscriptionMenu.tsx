import { Field } from "src/components/DynamicForm/types";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";
import Select from "src/components/FormElementsv2/Select/Select";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Text } from "src/components/Typography/Typography";
import { useGlobalData } from "src/providers/GlobalDataProvider";
import { Subscription } from "src/types/subscription";

type SubscriptionMenuProps = {
  formData: any;
  field: Omit<Field, "label" | "subLabel">;
  subscriptions: Subscription[];
  subscriptionInstanceCountHash: Record<string, number>;
  isCloudAccountForm?: boolean;
};

const SubscriptionMenu: React.FC<SubscriptionMenuProps> = ({
  formData,
  field,
  subscriptions,
  subscriptionInstanceCountHash = {},
  isCloudAccountForm = false,
}) => {
  const { values, touched, errors, handleChange, handleBlur } = formData;
  const { serviceOfferingsObj } = useGlobalData();

  return (
    <Select
      isLoading={field.isLoading}
      id={field.name}
      name={field.name}
      value={field.value || values[field.name] || ""}
      onBlur={(e) => {
        field.onBlur?.(e);
        handleBlur(e);
      }}
      onChange={(e) => {
        field.onChange?.(e);
        handleChange(e);
      }}
      error={Boolean(touched[field.name] && errors[field.name])}
      disabled={field.disabled}
      sx={{ mt: 0 }}
    >
      {subscriptions?.length > 0 ? (
        subscriptions.map((subscription) => {
          const plan = serviceOfferingsObj?.[subscription.serviceId]?.[subscription.productTierId] || {};
          const limit = subscription.maxNumberOfInstances ?? plan.maxNumberOfInstances ?? 0;
          const isInstanceLimitReached = subscriptionInstanceCountHash[subscription.id] >= limit;

          const hasPaymentIssue =
            !subscription.paymentMethodConfigured &&
            !(subscription.allowCreatesWhenPaymentNotConfigured ?? plan.allowCreatesWhenPaymentNotConfigured);

          const isDisabled =
            !["editor", "root"].includes(subscription.roleType) ||
            (!isCloudAccountForm && (isInstanceLimitReached || hasPaymentIssue));

          let disabledMessage = "";
          if (isInstanceLimitReached) {
            disabledMessage = "Instance limit reached";
          } else if (hasPaymentIssue) {
            disabledMessage = "Payment configuration required";
          } else if (subscription.roleType === "reader") {
            disabledMessage = "Readers cannot create instances";
          }
          const role = subscription.roleType;

          const menuItem = (
            <MenuItem key={subscription.id} value={subscription.id} disabled={isDisabled}>
              <div className="flex items-center gap-2">
                {role === "root" ? <SubscriptionTypeDirectIcon /> : <SubscriptionTypeInvitedIcon />}
                {subscription.id} ({role && role.charAt(0).toUpperCase() + role.slice(1)})
                {isDisabled && (
                  <Text size="small" weight="regular" color="#DC6803">
                    {" "}
                    {disabledMessage}
                  </Text>
                )}
              </div>
            </MenuItem>
          );

          if (isDisabled && disabledMessage) {
            return (
              <Tooltip title={disabledMessage} key={subscription.id} placement="top">
                <span>{menuItem}</span>
              </Tooltip>
            );
          }

          return menuItem;
        })
      ) : (
        <MenuItem value="" disabled>
          <i>{field.emptyMenuText || "No Options"}</i>
        </MenuItem>
      )}
    </Select>
  );
};

export default SubscriptionMenu;
