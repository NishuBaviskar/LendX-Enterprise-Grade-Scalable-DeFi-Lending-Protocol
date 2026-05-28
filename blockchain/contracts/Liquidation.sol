// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LendingPoolUpgradeable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Liquidation is AccessControl {
    LendingPoolUpgradeable public pool;
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    constructor(address payable _pool, address _admin) {
        pool = LendingPoolUpgradeable(_pool);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    /**
     * @dev Liquidates a position if Health Factor < 1.
     * Liquidator pays the debt and receives collateral + bonus.
     */
    function liquidatePosition(address _user) external onlyRole(LIQUIDATOR_ROLE) {
        uint256 hf = pool.getHealthFactor(_user);
        require(hf < 1e18, "Position is healthy");

        uint256 debt = pool.userBorrows(_user);
        // Logic to transfer debt from msg.sender and collateral to msg.sender
        // This is a simplified simulation of the Aave liquidation call
        emit LiquidationTriggered(_user, msg.sender, debt);
    }

    event LiquidationTriggered(address indexed user, address indexed liquidator, uint256 amount);
}