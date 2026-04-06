// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

library Assert {
    event AssertionEvent(string message, bool result);

    function equal(uint256 a, uint256 b, string memory message) internal {
        if (a == b) emit AssertionEvent(message, true);
        else revert(message);
    }

    function equal(bytes32 a, bytes32 b, string memory message) internal {
        if (a == b) emit AssertionEvent(message, true);
        else revert(message);
    }
}
