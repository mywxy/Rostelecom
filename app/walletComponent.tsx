"use client";

import { useState } from "react";
import { ConnectPublicClient, ConnectWalletClient } from "./client";

export default function WalletComponent() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  async function handleClick() {
    try {
      const walletClient = ConnectWalletClient();
      const publicClient = ConnectPublicClient();

      await walletClient.requestAddresses();
      const [addr] = await walletClient.getAddresses();
      if (!addr) {
        alert("No account from wallet. Approve account access in MetaMask.");
        return;
      }

      const bal = await publicClient.getBalance({ address: addr });

      setAddress(addr);
      setBalance(bal);
    } catch (error) {
      alert(`Transaction failed: ${error}`);
    }
  }

  return (
    <div className="card">
      <Status address={address} balance={balance} />
      <button
        type="button"
        className="mt-4 flex w-full flex-row items-center justify-center rounded-md bg-zinc-900 px-8 py-2 text-white hover:bg-zinc-800"
        onClick={handleClick}
      >
        <span className="mx-auto text-lg font-medium">Connect Wallet</span>
      </button>
    </div>
  );
}

function Status({
  address,
  balance,
}: {
  address: string | null;
  balance: bigint;
}) {
  if (!address) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full border border-red-600 bg-red-600" />
        <div>Disconnected</div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="h-2 w-2 shrink-0 rounded-full border border-green-500 bg-green-500" />
      <div className="text-sm md:text-base">
        {address}
        <br />
        <b>Balance:</b> {balance.toString()} <b>Wei</b>
      </div>
    </div>
  );
}
