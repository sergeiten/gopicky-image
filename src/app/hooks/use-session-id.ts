"use client";

import { generateId } from "@/lib/utils";
import { useEffect, useState } from "react";

const useSessionId = () => {
  // It's no possible to use sessionStorage in useState initialize function
  // Read details here: https://nextjs-faq.com/browser-api-client-component
  // Move initialize sessionId value to useEffect hook
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("sessionId");

    if (id) {
      setSessionId(id);

      return;
    }

    const newId = generateId();
    sessionStorage.setItem("sessionId", newId);
    setSessionId(newId);
  }, []);

  return sessionId;
};

export default useSessionId;
