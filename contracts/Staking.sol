//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {

    struct Stake{
        uint256 staking;
        uint256 stakingCooldown;
        uint256 rewardCooldown;
    }

    IERC20 private _stakingToken;
    IERC20 private _rewardToken;

    uint256 private _percentage;

    address private _owner;

    uint256 private _stakingCooldown;
    uint256 private _rewardCooldown;

    mapping(address => Stake) private _stakings;

    event Staked(uint256 amount, uint256 until);
    event Unstaked(uint256 amount);
    event Claimed(uint256 amount);

    modifier forOwner {
        require(msg.sender == _owner, "Only owner can do that");
        _;
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Unable to stake 0 tokens");

        _stakingToken.transferFrom(msg.sender, address(this), amount);
        _stakings[msg.sender].staking += amount;
        _stakings[msg.sender].stakingCooldown = block.timestamp + _stakingCooldown;
        _stakings[msg.sender].rewardCooldown = block.timestamp + _rewardCooldown;

        emit Staked(amount, _stakings[msg.sender].stakingCooldown);
    }

    function unstake() public {
        require(_stakings[msg.sender].staking > 0, "No tokens to unstake");
        require(_stakings[msg.sender].stakingCooldown <= block.timestamp, "It's too early");

        uint256 staking = _stakings[msg.sender].staking;
        _stakings[msg.sender].staking = 0;
        _stakingToken.transfer(msg.sender, staking);
        emit Unstaked(staking);
    }

    function claim() public {
        require(_stakings[msg.sender].rewardCooldown <= block.timestamp, "It's too early");
        require(_stakings[msg.sender].staking > 0, "No tokens staked");

        uint256 reward = _stakings[msg.sender].staking * _percentage / 100;
        _rewardToken.transferFrom(_owner, msg.sender, reward);
        _stakings[msg.sender].rewardCooldown = block.timestamp + _rewardCooldown;
        emit Claimed(reward);
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
        _stakingToken = IERC20(stakingToken); // 0xf1C80DE1bb14aC337808A83b0e56A53425D72B67
        _rewardToken = IERC20(rewardToken);  //  0xc8eeF11F258158d2B9981DD4cE305eACF33Bf8b6

        _stakingCooldown = 20 minutes;
        _rewardCooldown = 10 minutes;
        _owner = msg.sender;
    }
}
