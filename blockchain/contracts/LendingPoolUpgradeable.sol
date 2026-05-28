// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title LendingPoolUpgradeable
 * @dev Core Protocol Contract: Implements Health Factor Math, Interest Simulation, and Role-Based Liquidation.
 */
contract LendingPoolUpgradeable is 
    Initializable,
    UUPSUpgradeable, 
    AccessControlUpgradeable, 
    ReentrancyGuardUpgradeable, 
    PausableUpgradeable 
{
    // --- Role Definitions ---
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    // --- State Variables ---
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userBorrows;
    mapping(address => bool) public blacklisted;
    
    // Global tracking for Auditor Dashboard & Liquidity Charts
    uint256 public totalBorrows; 

    // --- Financial Parameters ---
    uint256 public constant COLLATERAL_FACTOR = 80;    // Max LTV (80%)
    uint256 public constant LIQUIDATION_THRESHOLD = 85; // 85%
    uint256 public constant LIQUIDATION_BONUS = 10;    // 10% bonus for liquidators
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;  // 1.0 represented in Wad (18 decimals)

    // --- Events ---
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 amountSeized);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SUPER_ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // --- Core Financial Functions ---

    /**
     * @dev Users deposit ETH to act as collateral.
     */
    function deposit() external payable whenNotPaused {
        require(!blacklisted[msg.sender], "User blacklisted");
        require(msg.value > 0, "Amount must be > 0");

        userDeposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Lenders withdraw their deposited ETH.
     * @notice Enforces Health Factor check to prevent withdrawing collateral used for active loans.
     */
    function withdraw(uint256 _amount) external whenNotPaused nonReentrant {
        require(userDeposits[msg.sender] >= _amount, "Insufficient balance");
        
        // Safety check: Ensure withdrawal doesn't make an existing loan under-collateralized
        if (userBorrows[msg.sender] > 0) {
            uint256 remainingCollateral = userDeposits[msg.sender] - _amount;
            // HF = (Collateral * Threshold) / Borrow
            uint256 hf = (remainingCollateral * LIQUIDATION_THRESHOLD * 1e18) / (userBorrows[msg.sender] * 100);
            require(hf >= MIN_HEALTH_FACTOR, "Withdrawal risky: HF would be < 1.0");
        }

        userDeposits[msg.sender] -= _amount;
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, _amount);
    }

    /**
     * @dev Users borrow ETH against their collateral.
     * @notice Enforces the 80% LTV rule.
     */
    function borrow(uint256 _amount) external whenNotPaused nonReentrant {
        require(!blacklisted[msg.sender], "User blacklisted");
        
        uint256 maxBorrow = (userDeposits[msg.sender] * COLLATERAL_FACTOR) / 100;
        require(userBorrows[msg.sender] + _amount <= maxBorrow, "Insufficient collateral");

        userBorrows[msg.sender] += _amount;
        totalBorrows += _amount; // Global tracking
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit Borrowed(msg.sender, _amount);
    }

    /**
     * @dev Users repay their debt to improve their Health Factor.
     */
    function repay() external payable whenNotPaused {
        require(msg.value > 0, "Repay amount must be > 0");
        require(userBorrows[msg.sender] >= msg.value, "Over-repaying debt");

        userBorrows[msg.sender] -= msg.value;
        totalBorrows -= msg.value; // Global tracking
        
        emit Repaid(msg.sender, msg.value);
    }

    /**
     * @dev Liquidation logic: authorized liquidators can repay debt to seize collateral.
     */
    function liquidate(address _user) external payable nonReentrant {
        require(hasRole(LIQUIDATOR_ROLE, msg.sender), "Caller is not liquidator");
        uint256 hf = getHealthFactor(_user);
        require(hf < MIN_HEALTH_FACTOR, "User is safe");

        uint256 debt = userBorrows[_user];
        require(msg.value >= debt, "Insufficient repay amount");

        uint256 bonus = (debt * (100 + LIQUIDATION_BONUS)) / 100;
        require(userDeposits[_user] >= bonus, "Insolvent position");

        totalBorrows -= debt;
        userBorrows[_user] = 0;
        userDeposits[_user] -= bonus;

        payable(msg.sender).transfer(bonus);
        emit Liquidated(_user, msg.sender, bonus);
    }

    // --- Mathematical & Auditor View Functions ---

    /**
     * @dev Returns total ETH currently in the contract.
     */
    function getTotalReserves() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns total borrowed ETH across all users.
     */
    function getTotalBorrows() public view returns (uint256) {
        return totalBorrows;
    }

    /**
     * @dev Health Factor = (Collateral * Threshold) / Borrows.
     * Scale: 1e18 = 1.0.
     */
    function getHealthFactor(address _user) public view returns (uint256) {
        uint256 borrows = userBorrows[_user];
        if (borrows == 0) return 100e18; // Safe

        uint256 collateralValue = userDeposits[_user];
        uint256 collateralAdjusted = (collateralValue * LIQUIDATION_THRESHOLD) / 100;

        return (collateralAdjusted * 1e18) / borrows;
    }

    // --- Admin & Security ---

    function setBlacklist(address _user, bool _status) external onlyRole(SUPER_ADMIN_ROLE) {
        blacklisted[_user] = _status;
    }

    function togglePause() external onlyRole(SUPER_ADMIN_ROLE) {
        paused() ? _unpause() : _pause();
    }

    receive() external payable {}
}