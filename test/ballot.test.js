const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ballot", function () {
  it("test vote and winner", async function () {
    const candidates = [
      ethers.utils.formatBytes32String("candidate_0"),
      ethers.utils.formatBytes32String("candidate_1"),
    ];
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy(candidates);
    await ballot.deployed();
    console.log("Ballot deployed at:" + ballot.address);
    const [chairman, acc_1] = await ethers.getSigners();
    await ballot.giveRightToVote(acc_1.address);
    await ballot.connect(acc_1).vote(1);
    expect((await ballot.winningProposal()).toNumber()).to.equal(1);
  });
  it("test delegate", async function () {
    const candidates = [
      ethers.utils.formatBytes32String("candidate_0"),
      ethers.utils.formatBytes32String("candidate_1"),
    ];
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy(candidates);
    await ballot.deployed();
    console.log("Ballot deployed at:" + ballot.address);
    const [chairman, acc_1, acc_2] = await ethers.getSigners();
    await ballot.giveRightToVote(acc_1.address);
    await ballot.connect(acc_1).delegate(acc_2.address);
    await ballot.connect(acc_2).vote(1);
    expect((await ballot.winningProposal()).toNumber()).to.equal(1);
  });
});
