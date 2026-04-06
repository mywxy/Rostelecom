// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract VendingMachine {
    address public owner;
    mapping(address => uint256) public cupcakeBalances;
    uint256 public cupcakeStock = 100;

    constructor() {
        owner = msg.sender;
    }

    function getVendingMachineBalance() public view returns (uint256) {
        return cupcakeStock;
    }

    function purchase(uint256 amount) public payable {
        require(msg.value >= amount * 1e9, "VendingMachine: insufficient funds");
        require(cupcakeStock >= amount, "VendingMachine: out of stock");
        cupcakeStock -= amount;
        cupcakeBalances[msg.sender] += amount;
    }

    function refill(uint256 amount) public {
        require(msg.sender == owner, "VendingMachine: only owner");
        cupcakeStock += amount;
    }
}
