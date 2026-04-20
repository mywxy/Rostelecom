"use client";

import { useState } from "react";
import { getContract, type Address } from "viem";
import { homeworkErc20Abi } from "./homeworkErc20Abi";
import { ConnectPublicClient } from "./client";

/**
 * Independent exercise: verified Mintable USDC on Sepolia (ERC-20).
 * https://sepolia.etherscan.io/token/0xf450ef4f268eaf2d3d8f9ed0354852e255a5eaef
 */
const DEFAULT_ERC20 = "0xf450ef4f268eaf2d3d8f9ed0354852e255a5eaef";

export default function Erc20HomeworkComponent() {
  const [contractAddress, setContractAddress] = useState(DEFAULT_ERC20);

  const setValue =
    (setter: (v: string) => void) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function buttonClick() {
    try {
      const publicClient = ConnectPublicClient();
      const addr = contractAddress as Address;

      const contract = getContract({
        address: addr,
        abi: homeworkErc20Abi,
        client: publicClient,
      });

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
        contract.read.totalSupply(),
      ]);

      alert(
        `Name: ${name}\nSymbol: ${symbol}\nDecimals: ${decimals}\nTotal supply (raw): ${totalSupply.toString()}`,
      );
    } catch (error) {
      alert(`Failed: ${error}`);
    }
  }

  return (
    <div className="card">
      <label className="block">
        ERC-20 contract:
        <input
          placeholder="0x…"
          value={contractAddress}
          onChange={setValue(setContractAddress)}
        />
      </label>
      <button
        type="button"
        className="mt-4 flex w-full flex-row items-center justify-center rounded-md bg-emerald-800 px-8 py-2 text-white hover:bg-emerald-700"
        onClick={buttonClick}
      >
        <span className="text-center text-lg font-medium">ERC-20 info</span>
      </button>
    </div>
  );
}
