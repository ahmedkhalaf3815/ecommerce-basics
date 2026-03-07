"use client";

import { useEffect, useRef } from "react";
import { verifyCheckoutSession } from "@/components/lip/actions/checkOut";

export function ClearCartEffect({ sessionId }: { sessionId: string }) {
  const verified = useRef(false);

  useEffect(() => {
    if (sessionId && !verified.current) {
      verified.current = true;
      verifyCheckoutSession(sessionId).catch(console.error);
    }
  }, [sessionId]);

  return null;
}
