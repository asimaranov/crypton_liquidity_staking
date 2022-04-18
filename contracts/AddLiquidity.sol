//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;
import "./interfaces/Uniswap.sol";
import "./interfaces/ERC20.sol";

contract AddLiquidity {
    address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    event NewAmountA(uint256 amount);
    event NewAmountB(uint256 amount);
    event NewLiquidity(uint256 value);


    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) public {
        ERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        ERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        
        ERC20(_tokenA).approve(ROUTER, _amountA);
        ERC20(_tokenB).approve(ROUTER, _amountB);

        (uint256 newAmountA, uint256 newAmountB, uint256 newLiquidity) = 
        IUniswapV2Router(ROUTER).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 0, 0, address(this), block.timestamp);

        emit NewAmountA(newAmountA);
        emit NewAmountB(newAmountB);
        emit NewLiquidity(newLiquidity);

    }

    function addLiquidityEth(
        address _tokenA,
        uint256 _amountA
    ) public payable {
        ERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        ERC20(_tokenA).approve(ROUTER, _amountA);

        (uint256 newAmountA, uint256 newAmountB, uint256 newLiquidity) = 
        IUniswapV2Router(ROUTER).addLiquidityETH{value: msg.value}(_tokenA, _amountA, 0, 0, msg.sender, block.timestamp);

        emit NewAmountA(newAmountA);
        emit NewAmountB(newAmountB);
        emit NewLiquidity(newLiquidity);

    }

    constructor () payable {
    }


}
