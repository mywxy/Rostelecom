import { expect } from "chai";
import { ethers } from "hardhat";
import { TodoList } from "../typechain-types";

describe("TodoList", function () {
  let todoList: TodoList;

  before(async () => {
    const todoListFactory = await ethers.getContractFactory("TodoList");
    todoList = (await todoListFactory.deploy()) as TodoList;
    await todoList.waitForDeployment();
  });

  describe("addTask (write)", function () {
    it("Should add a task and increase task count", async function () {
      const [, author] = await ethers.getSigners();
      const text = "Сдать итоговый проект";

      await expect(todoList.connect(author).addTask(text))
        .to.emit(todoList, "TaskAdded")
        .withArgs(0n, author.address, text);

      expect(await todoList.getTaskCount()).to.equal(1n);
      const [storedText, done, storedAuthor] = await todoList.getTask(0);
      expect(storedText).to.equal(text);
      expect(done).to.equal(false);
      expect(storedAuthor).to.equal(author.address);
    });

    it("Should reject empty task text (require)", async function () {
      const [, author] = await ethers.getSigners();
      await expect(todoList.connect(author).addTask("")).to.be.revertedWith("Empty task text");
    });
  });

  describe("toggleDone (write + event)", function () {
    it("Should toggle task done and emit TaskToggled", async function () {
      const [, author, other] = await ethers.getSigners();
      await todoList.connect(author).addTask("Прочитать задание");

      await expect(todoList.connect(author).toggleDone(1)).to.emit(todoList, "TaskToggled").withArgs(1n, true);

      const [, done] = await todoList.getTask(1);
      expect(done).to.equal(true);

      await expect(todoList.connect(other).toggleDone(1)).to.be.revertedWith("Only author can toggle");
    });

    it("Should reject toggle for non-existent task (require)", async function () {
      const [, author] = await ethers.getSigners();
      await expect(todoList.connect(author).toggleDone(999)).to.be.revertedWith("Task does not exist");
    });
  });
});
