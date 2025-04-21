import { Text } from "src/components/Typography/Typography";

function DeleteAccount() {
  return (
    <div className="border border-[#E9EAEB] rounded-[12px]">
      <div className="px-6 py-5 border-b border-[#E9EAEB]">
        <Text size="large" weight="semibold" color="#181D27">
          Delete Account
        </Text>
        <Text
          size="small"
          weight="regular"
          color="#535862"
          sx={{ marginTop: "2px" }}
        >
          Permanently delete your account and associated data from
          [Service-Provider-Name].
        </Text>
      </div>
      <div className="px-8 py-10 border-b border-[#E9EAEB]">
        <Text size="medium" weight="medium" color="#181D27">
          Delete Account
        </Text>
        <Text
          size="medium"
          weight="regular"
          color="#535862"
          sx={{ marginTop: "12px" }}
        >
          Upon deletion, the following data will be permanently removed: Your
          profile information (name, email, login credentials) Access tokens,
          and CLI configurations Activity logs associated with your account
        </Text>
        <div className="mt-6 bg-[#FAFAFA] p-4 border border-[#E9EAEB] rounded-[8px]">
          <Text size="medium" weight="semibold" color="#D92D20">
            Important to know:
          </Text>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
