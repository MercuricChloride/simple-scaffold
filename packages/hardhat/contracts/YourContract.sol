pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

/*
Welcome to the placeth game!
A coordination game inspired by reddit place built by @blind_nabler

This contract contains the data required to render the data for the game, as well as interact with the game itself.

The concept is simple, every set amount of time, a user can change the color of a single pixel on a 500*500 board of pixels for a small fee.

This removes a lot of the value and usefulness of the individual, and encourages coordination in order to do anything meaningful.

After the game is over, the team that has the largest amount of tiles will win a chunk of the pool which contains the fees collected from the game.

As well as everyone will receieve an nft for each pixel on the board they owned, and the final board state will be auctioned off as a 1/1 NFT
---
Data structure:

we are going to have 2 arrays, one containing the color info for each pixel,
and one containing the current "owner" of the pixel (this may be redundant)

There is going to be a payable function write(pixel, color) that takes in a pixel arg (index in the array) and a color arg(uin8 representing the color);

The fee is going to be collected and the data for colors[pixel] = color; and address[pixel] = msg.sender;

There is going to be a check for the last placement of a users pixel, and if it was less than 5 mins ago the tx will fail.

Each time a pixel is written, an event will be emitted, and from these events the board will be colored in on the users end.

*/

contract YourContract is Ownable {
    uint256 public constant fee = 0.001 ether;
    address public constant blindnabler = 0x807a1752402D21400D555e1CD7f175566088b955;
    uint256 public gameOver;

    uint8[250000] public colors;
    address[250000] public ownerOfPixel;
    mapping(address => uint256) public lastPlacement;

    event Pixel(uint256 pixel, uint8 color);

    constructor(uint256 _gameOver, address _owner) payable {
        // transfer ownership
        transferOwnership(_owner);
        // Set the timestamp for the game to be complete
        gameOver = _gameOver;
    }

    function write(uint256 _pixel, uint8 _color) public payable {
        require(lastPlacement[msg.sender] <= block.timestamp - 5 minutes, "Must wait at least 5 minutes before placing another pixel");
        require(msg.value >= fee, "fee too low");
        require(block.timestamp < gameOver, "Game is finished");

        colors[_pixel] = _color;
        ownerOfPixel[_pixel] = msg.sender;
        lastPlacement[msg.sender] = block.timestamp;
        emit Pixel(_pixel, _color);
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
