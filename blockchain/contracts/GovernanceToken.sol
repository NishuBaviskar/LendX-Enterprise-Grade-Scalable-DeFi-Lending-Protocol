// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GovernanceToken
 * @dev Standard ERC20 with Voting and Permit capabilities for LendX DAO.
 */
contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() 
        ERC20("LendX Governance", "LNDX") 
        ERC20Permit("LendX Governance") 
        Ownable(msg.sender) 
    {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    // --- Required Overrides ---

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}