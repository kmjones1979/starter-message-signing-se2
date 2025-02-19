"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Toaster, toast } from "react-hot-toast";
import { verifyMessage } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const MessageSigning: NextPage = () => {
  const [message, setMessage] = useState("I'd like to receive Base Sepolia ETH!");
  const [signature, setSignature] = useState("");
  const [recoveredAddress, setRecoveredAddress] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000");
  const [isVerified, setIsVerified] = useState(false);

  const { address, isConnected } = useAccount();

  const requestAirdrop = async (signature: string) => {
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again tomorrow.");
        return;
      }

      if (data.success) {
        toast.success(`Received ${data.amount} Base Sepolia ETH! Transaction: ${data.hash}`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("request failed:", error);
      toast.error("request failed");
    }
  };

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (signature: `0x${string}`) => {
        setSignature(signature);
        const verified = await verifyMessage({
          message,
          signature,
          address: address as `0x${string}`,
        });
        setIsVerified(verified);
        setRecoveredAddress(address as `0x${string}`);

        // Request airdrop after successful signature
        if (verified) {
          await requestAirdrop(signature);
        }
      },
    },
  });

  const handleSign = () => {
    if (!message) return;
    signMessage({ message });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            width: "100%",
          },
        }}
      />
      <div className="space-y-2">
        {isConnected && <Address address={address} />}
        <label className="block text-sm font-medium p-2">Message to Sign</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="Enter a message to sign"
        />
      </div>

      <button onClick={handleSign} className="px-4 py-2">
        Sign Message
      </button>

      {signature && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Signature</h3>
            <div className="p-2 rounded break-all">{signature}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Recovered Address</h3>
            <div className="p-2  rounded">{recoveredAddress}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Verification Status</h3>
            <div className={`p-2 rounded ${isVerified ? "bg-green-400" : "bg-red-400"}`}>
              {isVerified ? "Signature Verified ✓" : "Verification Failed ✗"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSigning;
