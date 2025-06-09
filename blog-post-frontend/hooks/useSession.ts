import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useSessionData = () => {
  const [session, setSession] = useState({
    user: { id: "", name: "", email: "" },
    accessToken: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const nextSession = await getSession();
      if (nextSession) {
        setSession({
          user: {
            id: (nextSession.user as any)?.id ?? "",
            name: nextSession.user?.name ?? "",
            email: nextSession.user?.email ?? "",
          },
          accessToken: (nextSession as any).accessToken ?? "",
        });
      }
    };
    fetch();
  }, []);

  return session;
};
