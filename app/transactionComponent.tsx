"use client";

import { useState } from "react";
import { parseGwei } from "viem";
import { ConnectWalletClient } from "./client";

export default function TransactionComponent() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue =
    (setter: (v: string) => void) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function handleClick() {
    try {
      const walletClient = ConnectWalletClient();
      await walletClient.requestAddresses();
      const [address] = await walletClient.getAddresses();
      if (!address) {
        alert("No account from wallet.");
        return;
      }
      const hash = await walletClient.sendTransaction({
        account: address,
        to: recipient as `0x${string}`,
        value: parseGwei(amount),
      });
      alert(`Transaction successful. Transaction Hash: ${hash}`);
    } catch (error) {
      alert(`Transaction failed: ${error}`);
    }
  }

  return (
    <div className="card">
      <label className="block">
        Amount:
        <input
          placeholder="GWei"
          value={amount}
          onChange={setValue(setAmount)}
        />
      </label>

      <label className="block">
        Recipient:
        <input
          placeholder="Address"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>
      <button
        type="button"
        className="mt-4 flex w-full flex-row items-center justify-center rounded-md bg-zinc-900 px-8 py-2 text-white hover:bg-zinc-800"
        onClick={handleClick}
      >
        Send Transaction
      </button>
    </div>
  );
}
