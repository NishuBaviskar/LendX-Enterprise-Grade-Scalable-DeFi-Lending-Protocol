// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ShardedPool
 * @dev Implements Pool Segmentation (Sharding) to isolate risk.
 * Each shard has independent liquidity and risk parameters.
 */
contract ShardedPool {
    enum ShardType { ETH, STABLE, HIGH_RISK }

    struct Shard {
        uint256 totalLiquidity;
        uint256 interestRate; // Base in BP (1/100th of percent)
        uint256 collateralFactor;
        bool isActive;
    }

    mapping(ShardType => Shard) public shards;

    constructor() {
        shards[ShardType.ETH] = Shard(0, 500, 80, true);         // 5% Int, 80% LTV
        shards[ShardType.STABLE] = Shard(0, 300, 90, true);      // 3% Int, 90% LTV
        shards[ShardType.HIGH_RISK] = Shard(0, 1500, 50, true);  // 15% Int, 50% LTV
    }

    // Gas Optimized using calldata and unchecked math
    function updateLiquidity(ShardType _type, uint256 _amount, bool _isAdd) external {
        Shard storage shard = shards[_type];
        unchecked {
            if (_isAdd) {
                shard.totalLiquidity += _amount;
            } else {
                shard.totalLiquidity -= _amount;
            }
        }
    }

    function getShardInfo(ShardType _type) external view returns (Shard memory) {
        return shards[_type];
    }
}