"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { verifyMessage } from "viem";
import { useAccount, useConnect, useSignMessage } from "wagmi";

const MessageSigning: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [message, setMessage] = useState("Hello Web3!");
  const [signature, setSignature] = useState("");
  const [recoveredAddress, setRecoveredAddress] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000");
  const [isVerified, setIsVerified] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

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
      },
    },
  });

  const handleSign = () => {
    if (!message) return;
    signMessage({ message });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Message to Sign</label>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
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
