import { NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

if (!process.env.AIRDROP_PRIVATE_KEY) {
  throw new Error("AIRDROP_PRIVATE_KEY is required");
}

// Configure for Base Sepolia testnet
const account = privateKeyToAccount(process.env.AIRDROP_PRIVATE_KEY as `0x${string}`);
const AIRDROP_AMOUNT = "0.01"; // Amount in Base Sepolia ETH

// Simple in-memory store for rate limiting
// Note: This will reset when the serverless function cold starts
const lastAirdropTime: { [address: string]: number } = {};
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

export async function POST(request: Request) {
  try {
    const { address, message, signature } = await request.json();

    // Check rate limit
    const now = Date.now();
    const lastAirdrop = lastAirdropTime[address] || 0;
    if (now - lastAirdrop < COOLDOWN_PERIOD) {
      const hoursRemaining = Math.ceil((COOLDOWN_PERIOD - (now - lastAirdrop)) / (60 * 60 * 1000));
      return NextResponse.json(
        { error: `Please wait ${hoursRemaining} hours before requesting another airdrop` },
        { status: 429 },
      );
    }

    // Verify the signature
    const isValid = await publicClient.verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Send ETH
    const hash = await walletClient.sendTransaction({
      to: address as `0x${string}`,
      value: parseEther(AIRDROP_AMOUNT),
    });

    // Wait for transaction
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Update rate limit
    lastAirdropTime[address] = now;

    return NextResponse.json({
      success: true,
      hash: receipt.transactionHash,
      amount: AIRDROP_AMOUNT,
    });
  } catch (error) {
    console.error("Airdrop error:", error);
    return NextResponse.json({ error: "Airdrop failed" }, { status: 500 });
  }
}
