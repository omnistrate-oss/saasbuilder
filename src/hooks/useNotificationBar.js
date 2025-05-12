import { useContext } from "react";

import { NotificationBarContext } from "../context/NotificationBarProvider";

function useNotificationBar() {
  const notificationBar = useContext(NotificationBarContext);

  return notificationBar;
}

export default useNotificationBar;
