import { useRouter } from "next/router";
import { getUser } from "../utils/api/user";

const Home = () => {
  const router = useRouter();
  getUser()
    .then((user) => {
      router.push("/home/1");
    })
    .catch((err) => {
      router.push("/login");
    });

  return null;
};

export default Home;
