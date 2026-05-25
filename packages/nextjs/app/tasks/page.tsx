import type { NextPage } from "next";
import { TodoListApp } from "~~/components/TodoListApp";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "TODO — запись",
  description: "Добавление и отметка задач через смарт-контракт TodoList",
});

const TasksPage: NextPage = () => {
  return <TodoListApp mode="write" />;
};

export default TasksPage;
