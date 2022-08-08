import Cookies from "js-cookie";
import { GetServerSidePropsContext } from "next";

export interface PossibleContext {
  context?: GetServerSidePropsContext;
}

export function getToken({ context }: PossibleContext = {}) {
  let isServer = typeof window === "undefined";
  if (isServer) {
    if (!context) return;
    const req = context.req;
    const { cookies } = req;
    return cookies?.jwt;
  } else {
    return Cookies.get("jwt") || localStorage.getItem("jwt");
  }
}
