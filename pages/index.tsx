import { useCheckLogin } from "../hooks/useCheckLogin";

const Home = () => {
  useCheckLogin("/1");
  return null;
};

export default Home;
