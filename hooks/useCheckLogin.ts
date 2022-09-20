import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "../utils/api/user";

export function useCheckLogin(successPath?: string) {
  const router = useRouter();
  useEffect(() => {
    async function checkLogin() {
      return getUser()
        .then((user) => {
          if (successPath) router.push(successPath);
        })
        .catch((err) => {
          console.error({ err });
          router.push("/login");
        });
    }
    checkLogin();
  }, [router, successPath]);
}
