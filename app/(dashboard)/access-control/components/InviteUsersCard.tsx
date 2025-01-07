"use client";

import React from "react";
import { Add } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, FormikProvider, useFormik } from "formik";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import Button from "components/Button/Button";
import Form from "components/FormElementsv2/Form/Form";
import { Text } from "components/Typography/Typography";
import Select from "components/FormElementsv2/Select/Select";
import MenuItem from "components/FormElementsv2/MenuItem/MenuItem";
import TextField from "components/FormElementsv2/TextField/TextField";
import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";

import useSnackbar from "src/hooks/useSnackbar";
import { inviteSubscriptionUser } from "src/api/users";
import { useGlobalData } from "src/providers/GlobalDataProvider";

const getNewEnvVariable = () => {
  return {
    email: "",
    roleType: "",
    serviceId: "",
    servicePlanId: "",
  };
};

const getServiceMenuItems = (serviceOfferings: any) => {
  const serviceIdSet = new Set();
  const serviceMenuItems = serviceOfferings.map((service) => {
    if (!serviceIdSet.has(service.serviceId)) {
      serviceIdSet.add(service.serviceId);
      return {
        label: service.serviceName,
        value: service.serviceId,
      };
    }
    return null;
  });
  return serviceMenuItems.filter((item) => item !== null);
};

const getServicePlanMenuItems = (serviceOfferings: any, serviceId: string) => {
  const servicePlanMenuItems = serviceOfferings
    .filter((service) => service.serviceId === serviceId)
    .map((service) => {
      return {
        label: service.productTierName,
        value: service.productTierID,
      };
    });
  return servicePlanMenuItems;
};

const InviteUsersCard = () => {
  const snackbar = useSnackbar();
  const { subscriptions, isFetchingServiceOfferings, serviceOfferings } =
    useGlobalData();

  const createUserInvitesMutation = useMutation(async (data: any) => {
    try {
      await Promise.all(
        data.userInvite.map((d) => {
          const payload = {
            email: d.email,
            roleType: d.roleType,
          };

          const subscription = subscriptions.find(
            (sub) =>
              sub.serviceId === d.serviceId &&
              sub.productTierId === d.servicePlanId
          );
          return inviteSubscriptionUser(subscription?.id, payload);
        })
      );
      snackbar.showSuccess("Invites Sent");
      // eslint-disable-next-line no-use-before-define
      formData.resetForm();
    } catch (error) {
      snackbar.showError("Failed to send invites");
    } finally {
      refetchUsers();
    }
  });

  const formData = useFormik({
    initialValues: {
      userInvite: [
        {
          email: "",
          roleType: "",
          serviceId: "",
          servicePlanId: "",
        },
      ],
    },
    onSubmit: (values) => {
      const valuesToBeSubmitted = structuredClone(values);

      for (let i = 0; i < valuesToBeSubmitted?.userInvite?.length; i++) {
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Editor") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "editor";
        }
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Reader") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "reader";
        }
      }
      createUserInvitesMutation.mutate(valuesToBeSubmitted);
    },
  });

  const { values, handleChange, handleBlur, setFieldValue } = formData;

  return (
    <div className="shadow-[0_1px_2px_0_#0A0D120D] rounded-xl border border-[#E9EAEB] bg-white mb-6">
      {/* @ts-ignore */}
      <Form onSubmit={formData.handleSubmit}>
        <FormikProvider value={formData}>
          <div className="flex items-center justify-between gap-4 pt-4 px-6">
            <DataGridHeaderTitle
              title="Invite Users"
              desc="Get your projects up and running faster by inviting your users to collaborate"
            />

            <Button
              variant="contained"
              startIcon={<EmailOutlinedIcon />}
              type="submit"
            >
              Send Invites
            </Button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              <FieldArray
                name="userInvite"
                render={({ remove, push }) => {
                  return (
                    <>
                      {values.userInvite.map((invite, index) => {
                        const serivceMenuItems =
                          getServiceMenuItems(serviceOfferings);

                        const servicePlanMenuItems = getServicePlanMenuItems(
                          serviceOfferings,
                          values.userInvite[index].serviceId
                        );

                        return (
                          <React.Fragment key={index}>
                            <TextField
                              required
                              placeholder="you@example.com"
                              value={invite.email}
                              onChange={handleChange}
                              name={`userInvite[${index}].email`}
                              sx={{
                                minWidth: "240px",
                                flex: 1,
                                "& .MuiInputAdornment-root": {
                                  border: "none", // Remove the default border of Input Adornment
                                  paddingRight: "0px",
                                },
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <Select
                              required
                              name={`userInvite[${index}].roleType`}
                              value={invite.roleType}
                              onChange={handleChange}
                              sx={{ flex: 1 }}
                              displayEmpty
                              renderValue={(value) => {
                                if (value) return value;
                                return "Role";
                              }}
                            >
                              {["Editor", "Reader"].map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            <Select
                              required
                              isLoading={isFetchingServiceOfferings}
                              name={`userInvite[${index}].serviceId`}
                              value={invite.serviceId}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue(
                                  `userInvite[${index}].servicePlanId`,
                                  ""
                                );
                              }}
                              sx={{ flex: 1 }}
                              displayEmpty
                              renderValue={(value) => {
                                if (!value) return "Technology";
                                return serivceMenuItems.find(
                                  (item) => item.value === value
                                )?.label;
                              }}
                            >
                              {serivceMenuItems?.length > 0 ? (
                                serivceMenuItems.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  <i>No Technologies found</i>
                                </MenuItem>
                              )}
                            </Select>
                            <Select
                              required
                              isLoading={isFetchingServiceOfferings}
                              name={`userInvite[${index}].servicePlanId`}
                              value={invite.servicePlanId}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              sx={{ flex: 1 }}
                              displayEmpty
                              renderValue={(value) => {
                                if (!value) return "Deployment Mode";
                                return servicePlanMenuItems.find(
                                  (item) => item.value === value
                                )?.label;
                              }}
                            >
                              {servicePlanMenuItems?.length > 0 ? (
                                servicePlanMenuItems.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  <i>
                                    {invite.serviceId
                                      ? "No deployment modes"
                                      : "Select a technology first"}
                                  </i>
                                </MenuItem>
                              )}
                            </Select>
                          </React.Fragment>
                        );
                      })}

                      <div
                        className="flex items-center gap-1.5 mt-4 cursor-pointer"
                        onClick={() => {
                          push(getNewEnvVariable());
                        }}
                      >
                        <Add sx={{ color: "#0E5FB5" }} />
                        <Text size="small" weight="semibold" color="#0E5FB5">
                          Add Another
                        </Text>
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </FormikProvider>
      </Form>
    </div>
  );
};

export default InviteUsersCard;
