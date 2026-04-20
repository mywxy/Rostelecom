import Erc20HomeworkComponent from "./erc20HomeworkComponent";
import TokenComponent from "./tokenComponent";
import TransactionComponent from "./transactionComponent";
import WalletComponent from "./walletComponent";

export default function Home() {
  return (
    <main className="min-h-screen py-10">
      <div className="flex flex-col items-center justify-center gap-8 px-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Multichain dApp (Sepolia)
        </h1>
        <WalletComponent />
        <TransactionComponent />
        <TokenComponent />
        <Erc20HomeworkComponent />
      </div>
    </main>
  );
}
