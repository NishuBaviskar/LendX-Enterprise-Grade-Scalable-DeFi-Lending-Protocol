// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RollupBatcher
 * @dev Implements Layer-2 style transaction batching to reduce L1 gas costs.
 * Used by: Lenders and Borrowers for high-frequency micro-transactions.
 */
contract RollupBatcher is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct Transaction {
        address user;
        uint256 amount;
        string action; // "DEPOSIT" or "REPAY"
        uint256 timestamp;
    }

    mapping(uint256 => Transaction[]) public batches;
    uint256 public currentBatchId;
    uint256 public constant BATCH_SIZE_LIMIT = 10;

    event BatchSubmitted(uint256 indexed batchId, uint256 txCount, bytes32 stateRoot);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    function submitTransaction(uint256 _amount, string calldata _action) external {
        batches[currentBatchId].push(Transaction({
            user: msg.sender,
            amount: _amount,
            action: _action,
            timestamp: block.timestamp
        }));

        if (batches[currentBatchId].length >= BATCH_SIZE_LIMIT) {
            _finalizeBatch();
        }
    }

    function _finalizeBatch() internal {
        bytes32 mockStateRoot = keccak256(abi.encodePacked(currentBatchId, block.timestamp));
        emit BatchSubmitted(currentBatchId, batches[currentBatchId].length, mockStateRoot);
        currentBatchId++;
    }

    function getBatch(uint256 _batchId) external view returns (Transaction[] memory) {
        return batches[_batchId];
    }
}