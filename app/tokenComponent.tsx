"use client";

import { useState } from "react";
import { getContract, type Address } from "viem";
import { contractAbi } from "./abi";
import { ConnectPublicClient } from "./client";

/** Lab ERC-721 on Sepolia (from course materials). */
const DEFAULT_NFT = "0xae2a37b60b7af7fcca8167df617f82a34f22719c";

export default function TokenComponent() {
  const [contractAddress, setContractAddress] = useState(DEFAULT_NFT);
  const [tokenId, setTokenId] = useState("1");

  const setValue =
    (setter: (v: string) => void) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function buttonClick() {
    try {
      const publicClient = ConnectPublicClient();
      const checkedAddress = contractAddress as Address;

      const contract = getContract({
        address: checkedAddress,
        abi: contractAbi,
        client: publicClient,
      });

      const symbol = await contract.read.symbol();
      const name = await contract.read.name();
      const token_id = BigInt(tokenId);
      const owner = await contract.read.ownerOf([token_id]);

      alert(
        `Symbol: ${symbol}\nName: ${name}\nOwner of token_id = ${token_id}: ${owner}`,
      );
    } catch (error) {
      alert(`Failed: ${error}`);
    }
  }

  return (
    <div className="card">
      <label className="block">
        Address:
        <input
          placeholder="Smart Contract Instance"
          value={contractAddress}
          onChange={setValue(setContractAddress)}
        />
      </label>

      <label className="block">
        Token Id:
        <input
          placeholder="1"
          value={tokenId}
          onChange={setValue(setTokenId)}
        />
      </label>
      <button
        type="button"
        className="mt-4 flex w-full flex-row items-center justify-center rounded-md bg-zinc-900 px-8 py-2 text-white hover:bg-zinc-800"
        onClick={buttonClick}
      >
        <span className="text-center text-lg font-medium">Token Info</span>
      </button>
    </div>
  );
}
