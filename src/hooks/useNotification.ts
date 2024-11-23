import { configurePushSub } from "@/lib/swUtils";
import { useEffect, useState } from "react";

export default function useNotification() {
  // Check if Notification API exists in the browser
  const isNotificationSupported = "Notification" in window;

  // Initialize permission status with the current Notification.permission value
  const [permissionStatus, setPermissionStatus] = useState(
    isNotificationSupported ? Notification.permission : "denied"
  );

  // Update permission status on mount
  useEffect(() => {
    if (isNotificationSupported) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Request notification permission from the user
  const askForNotificationPermission = async () => {
    if (!isNotificationSupported) {
      throw new Error("Notifications are not supported in this browser");
    }

    try {
      // Request permission and update the permission status
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission !== "granted") {
        // If permission is not granted, return immediately
        return;
      } else {
        // Otherwise, configure push subscription
        configurePushSub();
      }
    } catch (error) {
      throw new Error("Failed to request notification permission");
    }
  };

  // Return an object with permission status and askForNotificationPermission function
  return {
    permissionStatus: isNotificationSupported && permissionStatus === "granted",
    askForNotificationPermission,
    isSupported: isNotificationSupported,
  };
}
