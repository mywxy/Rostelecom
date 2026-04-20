import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";
import "viem/window";

export function ConnectPublicClient() {
  const transport =
    typeof window !== "undefined" && window.ethereum
      ? custom(window.ethereum)
      : http();

  return createPublicClient({
    chain: sepolia,
    transport,
  });
}

export function ConnectWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "Web3 wallet is not installed. Please install MetaMask or another EIP-1193 wallet.",
    );
  }

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
}
