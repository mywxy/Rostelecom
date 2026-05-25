//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title TodoList
 * @notice DApp TODO-лист: добавление задач и отметка выполнения (курс «Основы технологии блокчейн»)
 * @author Симоненко Матвей
 */
contract TodoList {
    struct Task {
        string text;
        bool done;
        address author;
    }

    Task[] private tasks;

    event TaskAdded(uint256 indexed taskId, address indexed author, string text);
    event TaskToggled(uint256 indexed taskId, bool done);

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }

    function getTask(uint256 taskId) public view returns (string memory text, bool done, address author) {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        return (task.text, task.done, task.author);
    }

    function addTask(string memory text) public {
        require(bytes(text).length > 0, "Empty task text");
        uint256 taskId = tasks.length;
        tasks.push(Task({ text: text, done: false, author: msg.sender }));
        emit TaskAdded(taskId, msg.sender, text);
    }

    function toggleDone(uint256 taskId) public {
        require(taskId < tasks.length, "Task does not exist");
        require(tasks[taskId].author == msg.sender, "Only author can toggle");
        tasks[taskId].done = !tasks[taskId].done;
        emit TaskToggled(taskId, tasks[taskId].done);
    }
}
