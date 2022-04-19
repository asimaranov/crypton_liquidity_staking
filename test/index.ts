import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { assert } from "console";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";

describe("Staking", function () {
  let stakingTokenContract: Contract;
  let rewardTokenContract: Contract;
  let stakingContract: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress;

  const stakingAmont = 1_000_000;
  const stakingRewardSupply = 1_000_000_000_000;
  const defaultStakingCooldown = 20 * 60;
  const defaultRewardCooldown = 10 * 60;
  const defaultPercentage = 20;


  this.beforeEach(async () => {
    const FakeTokenContract = await ethers.getContractFactory("FakeToken");

    stakingTokenContract = await FakeTokenContract.deploy();
    rewardTokenContract = await FakeTokenContract.deploy();
    
    const StakingContract = await ethers.getContractFactory("Staking");
    stakingContract = await StakingContract.deploy(stakingTokenContract.address, rewardTokenContract.address);
    
    
    [owner, user1] = await ethers.getSigners();

    await stakingTokenContract.deployed();
    await rewardTokenContract.deployed();
    await stakingContract.deployed();

    await rewardTokenContract.approve(stakingContract.address, stakingRewardSupply);
    await stakingTokenContract.transfer(user1.address, stakingAmont);

    stakingContract = stakingContract.connect(user1);
    stakingTokenContract = stakingTokenContract.connect(user1);
    rewardTokenContract = rewardTokenContract.connect(user1);

  })

  it("Check fail on zero coin staking", async function () {
    await expect(stakingContract.stake(0)).to.be.revertedWith("Unable to stake 0 tokens");
  });

  it("Check that user cant unstake during cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    await stakingContract.stake(stakingAmont);
    await expect(stakingContract.unstake()).to.be.revertedWith("It's too early");
  });

  it("Check that user cant unstake if haven't deposited any tokens", async function () {
    await expect(stakingContract.unstake()).to.be.revertedWith("No tokens to unstake");
  });

  it("Check that user cant get reward if haven't deposited any tokens", async function () {
    await expect(stakingContract.claim()).to.be.revertedWith("No reward to claim");
  });

  it("Check that user cant get reward during cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    await stakingContract.stake(stakingAmont);
    await expect(stakingContract.claim()).to.be.revertedWith("It's too early");
  });
              
  it("Check that user can unstake after cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    const initialBalance = await stakingTokenContract.balanceOf(user1.address);
    await stakingContract.stake(stakingAmont);

    const balanceAfterStake = await stakingTokenContract.balanceOf(user1.address);

    expect(initialBalance.sub(balanceAfterStake)).to.equal(stakingAmont);

    await network.provider.send("evm_increaseTime", [defaultStakingCooldown]); // Add 20 minutes
    await stakingContract.unstake();

    const balanceAfterUnstake = await stakingTokenContract.balanceOf(user1.address);
    expect(balanceAfterUnstake).to.equal(initialBalance);
  });

  it("Check that user can get reward after cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);

    const initialReward = await rewardTokenContract.balanceOf(user1.address);
    await stakingContract.stake(stakingAmont);

    const rewardAfterStake = await rewardTokenContract.balanceOf(user1.address);

    expect(initialReward).to.equal(rewardAfterStake);

    await network.provider.send("evm_increaseTime", [defaultRewardCooldown]); // Add 10 minutes
    await stakingContract.claim();

    const rewardAfterClaim = await rewardTokenContract.balanceOf(user1.address);

    expect(rewardAfterClaim - initialReward).to.be.equal(stakingAmont * defaultPercentage / 100);
  });

  it("Check that user can unstake after cooldown changed by owner", async function () {
    const newStakingCooldown = 3 * 60;  // 3 minutes
    await stakingContract.connect(owner).setStakingCooldown(newStakingCooldown);
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    const initialBalance = await stakingTokenContract.balanceOf(user1.address);
    await stakingContract.stake(stakingAmont);

    const balanceAfterStake = await stakingTokenContract.balanceOf(user1.address);

    expect(initialBalance.sub(balanceAfterStake)).to.equal(stakingAmont);

    await network.provider.send("evm_increaseTime", [newStakingCooldown]);
    await stakingContract.unstake();

    const balanceAfterUnstake = await stakingTokenContract.balanceOf(user1.address);
    expect(balanceAfterUnstake).to.equal(initialBalance);
  });

  it("Check that user can get reward after cooldown changed by owner", async function () {
    const newRewardCooldown = 3 * 60;  // 3 minutes
    await stakingContract.connect(owner).setRewardCooldown(newRewardCooldown);

    await stakingTokenContract.approve(stakingContract.address, stakingAmont);

    const initialReward = await rewardTokenContract.balanceOf(user1.address);
    await stakingContract.stake(stakingAmont);

    const rewardAfterStake = await rewardTokenContract.balanceOf(user1.address);

    expect(initialReward).to.equal(rewardAfterStake);

    await network.provider.send("evm_increaseTime", [newRewardCooldown]); // Add 10 minutes
    await stakingContract.claim();

    const rewardAfterUnstake = await rewardTokenContract.balanceOf(user1.address);
    expect(rewardAfterUnstake > initialReward);
  });


  it("Check percentage changing", async function () {
    const newPrecentage = 10;
    await stakingContract.connect(owner).setPercentage(newPrecentage);

    await stakingTokenContract.approve(stakingContract.address, stakingAmont);

    const initialReward = await rewardTokenContract.balanceOf(user1.address);
    await stakingContract.stake(stakingAmont);

    await network.provider.send("evm_increaseTime", [defaultRewardCooldown]); // Add 10 minutes
    await stakingContract.claim();

    const rewardAfterClaim = await rewardTokenContract.balanceOf(user1.address);

    expect(rewardAfterClaim - initialReward).to.be.equal(stakingAmont * newPrecentage / 100);
  });

  it("Check that only owner can change percentage", async function () {
    await expect(stakingContract.setPercentage(10)).to.be.revertedWith("Only owner can do that");
  });

  it("Check that only owner can change reward cooldown", async function () {
    await expect(stakingContract.setRewardCooldown(0)).to.be.revertedWith("Only owner can do that");
  });

  it("Check that only owner can change stake cooldown", async function () {
    await expect(stakingContract.setRewardCooldown(0)).to.be.revertedWith("Only owner can do that");
  });

});
