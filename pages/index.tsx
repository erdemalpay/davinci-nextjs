import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "../utils/api/user";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    getUser()
      .then((user) => {
        router.push("/home/1");
      })
      .catch((err) => {
        router.push("/login");
      });
  }, [router]);

  return null;
};

export default Home;
