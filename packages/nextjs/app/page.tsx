"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MessageSigning from "~~/components/MessageSigning";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-3xl font-bold text-center mb-8">Ethereum Message Signing Demo</h1>
        <MessageSigning />
      </div>
    </>
  );
};

export default Home;
