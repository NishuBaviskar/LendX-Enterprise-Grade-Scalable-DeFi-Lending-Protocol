// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CreditScore is AccessControl {
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    mapping(address => uint256) public scores; // 300 to 850 scale

    event ScoreUpdated(address indexed user, uint256 newScore);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
    }

    function updateScore(address _user, uint256 _score) external onlyRole(AUDITOR_ROLE) {
        require(_score >= 300 && _score <= 850, "Invalid score range");
        scores[_user] = _score;
        emit ScoreUpdated(_user, _score);
    }

    function getInterestRateDiscount(address _user) public view returns (uint256) {
        if (scores[_user] > 750) return 20; // 20% discount
        if (scores[_user] > 650) return 10;
        return 0;
    }
}