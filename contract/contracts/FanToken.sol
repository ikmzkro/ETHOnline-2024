// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IFanToken} from "./interface/IFanToken.sol";

contract FanToken is ERC20, ReentrancyGuard, IFanToken {
    constructor() ERC20("FanToken", "FT") {
        _mint(address(this), 10000_000_000_000_000_000_000); 
    }

    /**
     * @notice Allows msg.sender to withdraw a specified amount of tokens from the contract's balance.
     * @param amount The amount of tokens to withdraw.
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        // Transfer the specified amount from the contract's balance to msg.sender
        _transfer(address(this), msg.sender, amount);
    }

    // TODO: Func SelfClaim
}
