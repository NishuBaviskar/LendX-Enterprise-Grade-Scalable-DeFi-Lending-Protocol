// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

interface ILendingPoolProxy {
    function upgradeToAndCall(address newImplementation, bytes memory data) external;
}

contract DAOUpgradeable is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    address public lendingPoolProxy;
    
    struct Proposal {
        address newImplementation;
        uint256 voteCount;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event UpgradeProposed(uint256 indexed id, address implementation);
    event UpgradeExecuted(address indexed newImplementation);

    function initialize(address _poolProxy) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        lendingPoolProxy = _poolProxy;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    /**
     * @dev Propose a new logic contract for the LendingPool
     */
    function proposeUpgrade(address _newImplementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        proposalCount++;
        proposals[proposalCount] = Proposal(_newImplementation, 0, false);
        emit UpgradeProposed(proposalCount, _newImplementation);
    }

    /**
     * @dev Executes the upgrade on the LendingPool via the DAO
     */
    function executeUpgrade(uint256 _proposalId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage prop = proposals[_proposalId];
        require(!prop.executed, "Already executed");
        
        prop.executed = true;
        
        // Triggers the UUPS upgrade on the target LendingPool
        ILendingPoolProxy(lendingPoolProxy).upgradeToAndCall(prop.newImplementation, "");
        
        emit UpgradeExecuted(prop.newImplementation);
    }
}