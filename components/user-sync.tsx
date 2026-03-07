"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const UserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          }),
        });
      } catch (error) {
        console.error("[USER_SYNC]", error);
      }
    };
    syncUser();
  }, [isLoaded, user]);

  return null;
};
export default UserSync;
