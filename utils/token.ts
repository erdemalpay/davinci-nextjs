import Cookies from "js-cookie";

export function getToken() {
  let isServer = typeof window === "undefined";
  if (isServer) {
    return process.env.REVALIDATE_TOKEN || "";
  } else {
    return Cookies.get("jwt") || localStorage.getItem("jwt");
  }
}
