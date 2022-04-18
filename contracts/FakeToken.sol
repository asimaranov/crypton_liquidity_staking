//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
    constructor() ERC20("Fake token", "FAKE") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
