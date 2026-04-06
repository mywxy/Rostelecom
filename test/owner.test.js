const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Owner", function () {
  it("test contract owner", async function () {
    const [acc_0] = await ethers.getSigners();
    console.log(acc_0);
    const Owner = await ethers.getContractFactory("Owner");
    const owner = await Owner.deploy();
    await owner.deployed();
    console.log("Owner deployed at:" + owner.address);
    expect(await owner.getOwner()).to.equal(acc_0.address);
  });
  it("test change owner", async function () {
    const [acc_0, acc_1] = await ethers.getSigners();
    console.log(acc_0, acc_1);
    const Owner = await ethers.getContractFactory("Owner");
    const owner = await Owner.deploy();
    await owner.deployed();
    console.log("Owner deployed at:" + owner.address);
    await owner.changeOwner(acc_1.address);
    expect(await owner.getOwner()).to.equal(acc_1.address);
  });
});
