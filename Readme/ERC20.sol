// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


// Openzeppeline import 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/token/ERC20/ERC20.sol";

contract RGToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("RGToken", "RGT") {
        _mint(msg.sender, initialSupply);
    }
    
}