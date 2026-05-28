// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LendingPoolUpgradeable.sol";

interface IFlashLoanReceiver {
    function executeOperation(uint256 amount, uint256 fee, bytes calldata params) external returns (bool);
}

contract FlashLoan is ReentrancyGuard {
    LendingPoolUpgradeable public pool;
    uint256 public constant FLASH_LOAN_FEE = 9; // 0.09% fee

    event FlashLoanExecuted(address indexed borrower, uint256 amount, uint256 fee);

    constructor(address _pool) {
        pool = LendingPoolUpgradeable(payable(_pool));
    }

    /**
     * @dev The core flash loan function. 
     * If the receiver doesn't return the principal + fee, the whole TX reverts.
     */
    function executeFlashLoan(address receiverAddress, uint256 amount, bytes calldata params) external nonReentrant {
        uint256 balanceBefore = address(this).balance;
        require(balanceBefore >= amount, "Insufficient liquidity in Flash Provider");

        uint256 fee = (amount * FLASH_LOAN_FEE) / 10000;

        // 1. Transfer funds to borrower
        payable(receiverAddress).transfer(amount);

        // 2. Trigger borrower's logic
        require(
            IFlashLoanReceiver(receiverAddress).executeOperation(amount, fee, params),
            "Flash loan execution failed"
        );

        // 3. Check for repayment
        uint256 balanceAfter = address(this).balance;
        require(balanceAfter >= balanceBefore + fee, "Flash loan not repaid with fee");

        emit FlashLoanExecuted(receiverAddress, amount, fee);
    }

    receive() external payable {}
}