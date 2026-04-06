// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "../remix_tests.sol";
import "hardhat/console.sol";
import "../1_Storage.sol";

contract StorageTest {
    Storage storageToTest;

    function beforeAll() public {
        storageToTest = new Storage();
    }

    function checkWriteRead() public {
        console.log("Running checkWriteRead");
        storageToTest.store(42);
        Assert.equal(storageToTest.retrieve(), uint256(42), "proposal retreive should be 42");
    }
}
