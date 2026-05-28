// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    mapping(string => uint256) private prices;
    mapping(string => uint256) private lastUpdated;

    event PriceUpdated(string symbol, uint256 price, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function setPrice(string memory _symbol, uint256 _price) external onlyOwner {
        prices[_symbol] = _price;
        lastUpdated[_symbol] = block.timestamp;
        emit PriceUpdated(_symbol, _price, block.timestamp);
    }

    function getPrice(string memory _symbol) external view returns (uint256) {
        require(prices[_symbol] > 0, "Price not available");
        return prices[_symbol];
    }
}