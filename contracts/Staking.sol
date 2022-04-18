//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "./interfaces/ERC20.sol";

contract Staking {
    ERC20 private _stakingToken;
    ERC20 private _rewardToken;

    uint256 private _percentage;

    address private _owner;

    uint256 private _stakingCooldown;
    uint256 private _rewardCooldown;

    mapping(address => uint256) private _stakings;
    mapping(address => uint256) private _rewards;

    mapping(address => uint256) private _stakingCooldowns;
    mapping(address => uint256) private _rewardCooldowns;

    function stake(uint256 amount) public {
        require(amount > 0, "Unable to stake 0 tokens");
        _stakingToken.transferFrom(msg.sender, address(this), amount);
        _stakings[msg.sender] += amount;
        _rewards[msg.sender] += amount * _percentage / 100;

        _stakingCooldowns[msg.sender] = block.timestamp + _stakingCooldown;
        _rewardCooldowns[msg.sender] = block.timestamp + _rewardCooldown;
    }

    function unstake() public {
        require(_stakingCooldowns[msg.sender] <= block.timestamp, "No reward available");
        require(_stakings[msg.sender] > 0, "You haven't deposited any money");

        _stakingToken.transfer(msg.sender, _stakings[msg.sender]);
        _stakings[msg.sender] = 0;
        
    }

    function claim() public {
        require(_rewardCooldowns[msg.sender] >= block.timestamp, "It's too early");
        require(_rewards[msg.sender] > 0, "You haven't deposited any money");

        _rewardToken.transfer(msg.sender, _rewards[msg.sender]);
        _rewards[msg.sender] = 0;

    }

    modifier forOwner {
        require(msg.sender == _owner, "Only owner can do that");
        _;
    }

    function setPercentage(uint256 percentage) public forOwner{
        _percentage = percentage;
    }

    function setStakingCooldown(uint256 stakingCooldown) public forOwner{
        _stakingCooldown = stakingCooldown;
    }

    function setRewardCooldown(uint256 rewardCooldown) public forOwner{
        _rewardCooldown = rewardCooldown;
    }


    constructor(address stakingToken, address rewardToken) {
        _percentage = 20;
        _stakingToken = ERC20(stakingToken); // 0xf1C80DE1bb14aC337808A83b0e56A53425D72B67
        _rewardToken = ERC20(rewardToken);  //  0xc8eeF11F258158d2B9981DD4cE305eACF33Bf8b6

        _stakingCooldown = 20 minutes;
        _rewardCooldown = 10 minutes;
        _owner = msg.sender;
    }
}
