"use client";

import type { NextPage } from "next";
import MessageSigning from "~~/components/MessageSigning";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-3xl font-bold text-center mb-8">Base Sepolia Faucet</h1>
        <MessageSigning />
      </div>
    </>
  );
};

export default Home;
