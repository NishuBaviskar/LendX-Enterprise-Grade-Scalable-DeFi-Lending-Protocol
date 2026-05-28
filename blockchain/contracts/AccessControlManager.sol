// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessControlManager is AccessControl {
    // Roles
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");
    bytes32 public constant LENDER_ROLE = keccak256("LENDER_ROLE");
    bytes32 public constant BORROWER_ROLE = keccak256("BORROWER_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");
    bytes32 public constant DAO_MEMBER_ROLE = keccak256("DAO_MEMBER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    constructor(address superAdmin) {
        // SuperAdmin is the root of the DEFAULT_ADMIN_ROLE
        _grantRole(DEFAULT_ADMIN_ROLE, superAdmin);
        _grantRole(SUPER_ADMIN_ROLE, superAdmin);
        
        // Allow SUPER_ADMIN to manage all other roles
        _setRoleAdmin(LENDER_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(BORROWER_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(LIQUIDATOR_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(DAO_MEMBER_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(AUDITOR_ROLE, SUPER_ADMIN_ROLE);
    }

    /**
     * @dev SuperAdmin can instantly revoke or grant roles to anyone
     */
    function forceManageRole(bytes32 role, address account, bool grant) external onlyRole(SUPER_ADMIN_ROLE) {
        if (grant) {
            _grantRole(role, account);
        } else {
            _revokeRole(role, account);
        }
    }
}