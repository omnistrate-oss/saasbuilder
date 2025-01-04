"use client";

import { Add } from "@mui/icons-material";

import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";

const InviteUsersCard = () => {
  return (
    <div className="shadow-[0_1px_2px_0_#0A0D120D] rounded-xl border border-[#E9EAEB] bg-white mb-6">
      <div className="flex items-center justify-between gap-4 pt-4 px-6">
        <DataGridHeaderTitle
          title="Invite Users"
          desc="Get your projects up and running faster by inviting your users to collaborate"
        />

        <Button variant="contained">Send Invites</Button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">Hello</div>
        <div className="flex items-center gap-1.5 mt-4">
          <Add sx={{ color: "#0E5FB5" }} />
          <Text size="small" weight="semibold" color="#0E5FB5">
            Add Another
          </Text>
        </div>
      </div>
    </div>
  );
};

export default InviteUsersCard;
