"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

import { updateProfile } from "src/api/users";
import useSnackbar from "src/hooks/useSnackbar";
import Button from "components/Button/Button";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import FieldError from "components/FormElementsv2/FieldError/FieldError";
import FieldTitle from "components/FormElementsv2/FieldTitle/FieldTitle";
import Form from "components/FormElementsv2/Form/Form";
import TextField from "components/FormElementsv2/TextField/TextField";

import { FieldCell, FieldTitleCell, ProfileValidationSchema } from "./Common";
import FormHeader from "./FormHeader";

type ProfileFormProps = {
  userData: any;
  isLoadingUserData?: boolean;
  refetchUserData: () => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ userData, isLoadingUserData, refetchUserData }) => {
  const snackbar = useSnackbar();

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(userData?.id, data),
    onSuccess: () => {
      refetchUserData();
      snackbar.showSuccess("Profile updated successfully");
    },
  });

  const formData = useFormik({
    initialValues: {
      name: userData?.name || "",
      orgName: userData?.orgName || "",
      orgDescription: userData?.orgDescription || "",
      orgURL: userData?.orgURL || "",
      orgId: userData?.orgId || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const data = { ...values };
      // Remove Empty Fields
      for (const key in data) {
        if (data[key] === "") {
          delete data[key];
        }
      }

      updateProfileMutation.mutate(data as any);
    },
    validationSchema: ProfileValidationSchema,
  });

  const { values, handleChange, handleBlur, touched, errors } = formData;

  return (
    <div>
      <FormHeader
        title="Personal Info"
        description="Update your personal details here"
        className="pb-5 mb-6 border-b border-[#E9EAEB]"
      />

      {/* @ts-ignore */}
      <Form onSubmit={formData.handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-5">
          <FieldTitleCell>
            <FieldTitle required>Name</FieldTitle>
          </FieldTitleCell>
          <FieldCell>
            <TextField
              data-testid="name-input"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoadingUserData}
              sx={{ mt: 0 }}
            />
            <FieldError>{touched.name && errors.name}</FieldError>
          </FieldCell>

          <FieldTitleCell>
            <FieldTitle required>Organization ID</FieldTitle>
          </FieldTitleCell>
          <FieldCell>
            <TextField data-testid="organization-id-input" readOnly disabled value={values.orgId} sx={{ mt: 0 }} />
          </FieldCell>

          <FieldTitleCell>
            <FieldTitle required>Organization Name</FieldTitle>
          </FieldTitleCell>
          <FieldCell>
            <TextField
              data-testid="organization-name-input"
              name="orgName"
              id="orgName"
              value={values.orgName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoadingUserData || userData.roleType !== "root"}
              sx={{ mt: 0 }}
            />
            <FieldError>{touched.orgName && errors.orgName}</FieldError>
          </FieldCell>

          <FieldTitleCell>
            <FieldTitle>Organization Website URL</FieldTitle>
          </FieldTitleCell>
          <FieldCell>
            <TextField
              data-testid="organization-url-input"
              name="orgURL"
              id="orgURL"
              value={values.orgURL}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoadingUserData || userData.roleType !== "root"}
              sx={{ mt: 0 }}
            />
            <FieldError>{touched.orgURL && errors.orgURL}</FieldError>
          </FieldCell>
        </div>

        <div className="flex items-center justify-end gap-4 mt-5">
          <Button variant="outlined" onClick={() => formData.resetForm()} disabled={updateProfileMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={updateProfileMutation.isPending}>
            Save
            {updateProfileMutation.isPending && <LoadingSpinnerSmall />}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;
