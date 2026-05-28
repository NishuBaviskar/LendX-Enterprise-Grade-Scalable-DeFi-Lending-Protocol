// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FlashLoanProtection
 * @dev Mitigates flash loan price manipulation using block snapshots.
 */
contract FlashLoanProtection {
    struct PriceSnapshot {
        uint256 price;
        uint256 blockNumber;
    }

    mapping(address => PriceSnapshot) public assetSnapshots;

    // Prevents price updates and trades in the same block
    modifier antiFlashLoan(address _asset) {
        require(assetSnapshots[_asset].blockNumber < block.number, "Flash loan detected: Same block interaction prohibited");
        _;
    }

    function updatePrice(address _asset, uint256 _newPrice) external {
        assetSnapshots[_asset] = PriceSnapshot({
            price: _newPrice,
            blockNumber: block.number
        });
    }

    function getSafePrice(address _asset) public view returns (uint256) {
        return assetSnapshots[_asset].price;
    }
}