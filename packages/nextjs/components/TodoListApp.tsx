"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Address } from "@scaffold-ui/components";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type TaskItemProps = {
  taskId: number;
  showActions?: boolean;
  onUpdated?: () => void;
};

const TaskItem = ({ taskId, showActions = false, onUpdated }: TaskItemProps) => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { data: task, refetch } = useScaffoldReadContract({
    contractName: "TodoList",
    functionName: "getTask",
    args: [BigInt(taskId)],
  });

  const { writeContractAsync, isPending, isMining } = useScaffoldWriteContract({
    contractName: "TodoList",
  });

  if (!task) {
    return (
      <li className="list-row">
        <span className="loading loading-spinner loading-sm" />
      </li>
    );
  }

  const [text, done, author] = task;
  const isAuthor = connectedAddress?.toLowerCase() === author.toLowerCase();
  const busy = isPending || isMining;

  const handleToggle = async () => {
    try {
      await writeContractAsync({ functionName: "toggleDone", args: [BigInt(taskId)] });
      notification.success("Статус задачи обновлён");
      await refetch();
      onUpdated?.();
    } catch (error) {
      notification.error(getParsedError(error));
    }
  };

  return (
    <li className={`list-row items-center gap-2 ${done ? "opacity-70" : ""}`}>
      <div className="flex-1 min-w-0">
        <p className={`font-medium break-words ${done ? "line-through" : ""}`}>{text}</p>
        <div className="text-xs text-base-content/60 mt-1 flex flex-wrap items-center gap-2">
          <span>#{taskId}</span>
          <Address address={author} chain={targetNetwork} size="xs" onlyEnsOrAddress />
          {done && <span className="badge badge-success badge-sm">Выполнено</span>}
        </div>
      </div>
      {showActions && (
        <button
          type="button"
          className="btn btn-sm btn-outline shrink-0"
          disabled={!connectedAddress || !isAuthor || busy}
          onClick={handleToggle}
          title={!isAuthor ? "Только автор может менять статус" : undefined}
        >
          {busy ? <span className="loading loading-spinner loading-xs" /> : done ? "Снять" : "Готово"}
        </button>
      )}
    </li>
  );
};

type TodoListAppProps = {
  mode: "read" | "write";
};

export const TodoListApp = ({ mode }: TodoListAppProps) => {
  const { address: connectedAddress } = useAccount();
  const [newTaskText, setNewTaskText] = useState("");
  const [listKey, setListKey] = useState(0);

  const { data: taskCount, refetch: refetchCount } = useScaffoldReadContract({
    contractName: "TodoList",
    functionName: "getTaskCount",
  });

  const { writeContractAsync, isPending, isMining } = useScaffoldWriteContract({
    contractName: "TodoList",
  });

  const refreshList = useCallback(() => {
    void refetchCount();
    setListKey(k => k + 1);
  }, [refetchCount]);

  const count = taskCount ? Number(taskCount) : 0;
  const txBusy = isPending || isMining;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) {
      notification.warning("Введите текст задачи");
      return;
    }
    if (!connectedAddress) {
      notification.error("Подключите MetaMask");
      return;
    }
    try {
      await writeContractAsync({ functionName: "addTask", args: [text] });
      notification.success("Задача добавлена в блокчейн");
      setNewTaskText("");
      refreshList();
    } catch (error) {
      notification.error(getParsedError(error));
    }
  };

  const taskIds = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="flex flex-col items-center grow pt-8 px-4 pb-12 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">TODO на блокчейне</h1>
        <p className="text-base-content/70 mt-2">Симоненко Матвей · DApp «Учёт задач» · Scaffold-ETH 2</p>
        <div className="flex justify-center gap-2 mt-4">
          <Link href="/" className={`btn btn-sm ${mode === "read" ? "btn-primary" : "btn-ghost"}`}>
            Чтение
          </Link>
          <Link href="/tasks" className={`btn btn-sm ${mode === "write" ? "btn-primary" : "btn-ghost"}`}>
            Запись
          </Link>
        </div>
      </div>

      {!connectedAddress && (
        <div className="alert alert-warning w-full mb-6">
          <span>Подключите кошелёк (MetaMask) в шапке сайта для записи в контракт.</span>
        </div>
      )}

      {mode === "read" && (
        <section className="card bg-base-100 shadow-xl w-full">
          <div className="card-body">
            <h2 className="card-title">Данные из смарт-контракта</h2>
            <p className="text-sm text-base-content/70">
              Функции чтения: <code className="text-xs bg-base-300 px-1 rounded">getTaskCount</code>,{" "}
              <code className="text-xs bg-base-300 px-1 rounded">getTask</code>
            </p>
            <p className="text-lg">
              Всего задач: <span className="font-bold text-primary">{count}</span>
            </p>
            {count === 0 ? (
              <p className="text-base-content/60">Список пуст. Добавьте задачу на странице «Запись».</p>
            ) : (
              <ul className="list bg-base-200 rounded-box mt-2" key={listKey}>
                {taskIds.map(id => (
                  <TaskItem key={`${listKey}-${id}`} taskId={id} onUpdated={refreshList} />
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {mode === "write" && (
        <section className="card bg-base-100 shadow-xl w-full">
          <div className="card-body gap-4">
            <h2 className="card-title">Запись в контракт</h2>
            <p className="text-sm text-base-content/70">
              Функции записи: <code className="text-xs bg-base-300 px-1 rounded">addTask</code>,{" "}
              <code className="text-xs bg-base-300 px-1 rounded">toggleDone</code>
            </p>

            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Новая задача..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                disabled={txBusy}
              />
              <button type="submit" className="btn btn-primary" disabled={!connectedAddress || txBusy}>
                {txBusy ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Транзакция...
                  </>
                ) : (
                  "Добавить"
                )}
              </button>
            </form>

            {txBusy && (
              <div className="alert alert-info py-2">
                <span>Ожидание подтверждения в MetaMask / блокчейне…</span>
              </div>
            )}

            <div className="divider">Отметить выполненной</div>

            {count === 0 ? (
              <p className="text-base-content/60">Нет задач для изменения.</p>
            ) : (
              <ul className="list bg-base-200 rounded-box" key={listKey}>
                {taskIds.map(id => (
                  <TaskItem key={`${listKey}-${id}`} taskId={id} showActions onUpdated={refreshList} />
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
