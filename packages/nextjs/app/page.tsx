import type { NextPage } from "next";
import { TodoListApp } from "~~/components/TodoListApp";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "TODO — чтение",
  description: "Просмотр задач из смарт-контракта TodoList",
});

const Home: NextPage = () => {
  return <TodoListApp mode="read" />;
};

export default Home;
