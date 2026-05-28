// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AtomicSwap
 * @dev Cross-chain exchange simulation using Hash-Locked Timelock Contracts (HTLC).
 */
contract AtomicSwap {
    struct Swap {
        uint256 amount;
        bytes32 hashLock;
        uint256 timelock;
        address payable sender;
        address payable receiver;
        bool redeemed;
        bool refunded;
    }

    mapping(bytes32 => Swap) public swaps;

    event SwapLocked(bytes32 indexed id, uint256 amount, bytes32 hashLock);
    event SwapRedeemed(bytes32 indexed id, bytes32 secret);

    function lock(address payable _receiver, bytes32 _hashLock, uint256 _duration) external payable returns (bytes32 id) {
        id = keccak256(abi.encodePacked(msg.sender, _receiver, msg.value, _hashLock, block.timestamp));
        swaps[id] = Swap({
            amount: msg.value,
            hashLock: _hashLock,
            timelock: block.timestamp + _duration,
            sender: payable(msg.sender),
            receiver: _receiver,
            redeemed: false,
            refunded: false
        });
        emit SwapLocked(id, msg.value, _hashLock);
    }

    function redeem(bytes32 _id, bytes32 _secret) external {
        Swap storage swap = swaps[_id];
        require(keccak256(abi.encodePacked(_secret)) == swap.hashLock, "Invalid secret");
        require(!swap.redeemed, "Already redeemed");
        require(block.timestamp <= swap.timelock, "Expired");

        swap.redeemed = true;
        swap.receiver.transfer(swap.amount);
        emit SwapRedeemed(_id, _secret);
    }

    function refund(bytes32 _id) external {
        Swap storage swap = swaps[_id];
        require(block.timestamp > swap.timelock, "Not expired");
        require(!swap.redeemed && !swap.refunded, "Invalid state");

        swap.refunded = true;
        swap.sender.transfer(swap.amount);
    }
}