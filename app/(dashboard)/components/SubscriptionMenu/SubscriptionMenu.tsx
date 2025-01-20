import Tooltip from "src/components/Tooltip/Tooltip";
import Select from "src/components/FormElementsv2/Select/Select";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";
import { Field } from "src/components/DynamicForm/types";
import { Subscription } from "src/types/subscription";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";

type SubscriptionMenuProps = {
  formData: any;
  field: Omit<Field, "label" | "subLabel">;
  subscriptions: Subscription[];
};

const SubscriptionMenu: React.FC<SubscriptionMenuProps> = ({
  formData,
  field,
  subscriptions,
}) => {
  const { values, touched, errors, handleChange, handleBlur } = formData;

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
          const isDisabled = !["editor", "root"].includes(
            subscription.roleType
          );
          const disabledMessage = "Readers cannot create instances";
          const role = subscription.roleType;

          const menuItem = (
            <MenuItem
              key={subscription.id}
              value={subscription.id}
              disabled={!["editor", "root"].includes(role)}
            >
              <div className="flex items-center gap-2">
                {role === "root" ? (
                  <SubscriptionTypeDirectIcon />
                ) : (
                  <SubscriptionTypeInvitedIcon />
                )}
                {subscription.id} (
                {role && role.charAt(0).toUpperCase() + role.slice(1)})
              </div>
            </MenuItem>
          );

          if (isDisabled && disabledMessage) {
            return (
              <Tooltip
                title={disabledMessage}
                key={subscription.id}
                placement="top"
              >
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
