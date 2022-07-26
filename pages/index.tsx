import { useRouter } from "next/router";
import { getToken } from "../utils/token";
import { useEffect } from "react";

const Home = () => {
  const token = getToken();
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [router, token]);
  return null;
};

export default Home;
