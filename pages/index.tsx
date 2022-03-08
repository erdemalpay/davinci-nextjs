import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = ({ ...props }) => {
  console.log(props);
  return (
    <div className="font-bold">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        Welcome to <a href="https://nextjs.org"> first commit!</a>
      </h1>

      <p>
        Get started by editing <code>pages/index.tsx</code>
      </p>
    </div>
  );
};

export default Home;
