// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Bridge is AccessControl, ReentrancyGuard {
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    event Deposit(address indexed user, address token, uint256 amount, uint256 targetChainId);
    event Release(address indexed user, address token, uint256 amount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // UPDATED: Now handles both ETH and ERC20
    function lockToken(address _token, uint256 _amount, uint256 _targetChainId) external payable nonReentrant {
        if (_token == address(0)) {
            // Handle Native ETH
            require(msg.value == _amount, "Incorrect ETH amount sent");
        } else {
            // Handle ERC20
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        }
        
        emit Deposit(msg.sender, _token, _amount, _targetChainId);
    }

    function releaseToken(address _token, address _receiver, uint256 _amount) external onlyRole(RELAYER_ROLE) nonReentrant {
        if (_token == address(0)) {
            payable(_receiver).transfer(_amount);
        } else {
            IERC20(_token).transfer(_receiver, _amount);
        }
        emit Release(_receiver, _token, _amount);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}