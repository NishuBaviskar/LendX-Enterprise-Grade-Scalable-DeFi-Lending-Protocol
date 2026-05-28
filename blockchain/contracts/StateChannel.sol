// MODIFIED CODE: Fixed the extension from .js to .sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol"; // CHANGED .js to .sol
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StateChannel is ReentrancyGuard {
    using ECDSA for bytes32;

    struct Channel {
        address borrower;
        address lender;
        uint256 balance;
        uint256 expiration;
    }

    mapping(bytes32 => Channel) public channels;

    event ChannelOpened(bytes32 indexed channelId, address borrower, uint256 amount);
    event ChannelClosed(bytes32 indexed channelId, uint256 finalBalance);

    function openChannel(address _lender, uint256 _duration) external payable {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, _lender, block.timestamp));
        channels[id] = Channel(msg.sender, _lender, msg.value, block.timestamp + _duration);
        emit ChannelOpened(id, msg.sender, msg.value);
    }

    function closeChannel(bytes32 _id, uint256 _finalBalance, bytes memory _signature) external nonReentrant {
        Channel storage channel = channels[_id];
        require(block.timestamp <= channel.expiration, "Channel expired");
        
        // Correct usage of MessageHashUtils for OpenZeppelin v5
        bytes32 digest = keccak256(abi.encodePacked(_id, _finalBalance));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(digest);
        
        address signer = ethSignedMessageHash.recover(_signature);
        require(signer == channel.borrower, "Invalid signature");

        payable(channel.lender).transfer(_finalBalance);
        uint256 refund = channel.balance - _finalBalance;
        if (refund > 0) payable(channel.borrower).transfer(refund);

        delete channels[_id];
        emit ChannelClosed(_id, _finalBalance);
    }
}
    