import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";

describe("Staking", function () {
  let stakingTokenContract: Contract;
  let rewardTokenContract: Contract;
  let stakingContract: Contract;
  let owner: SignerWithAddress;

  const stakingAmont = 1_000_000;

  this.beforeEach(async () => {
    const FakeTokenContract = await ethers.getContractFactory("FakeToken");

    stakingTokenContract = await FakeTokenContract.deploy();
    rewardTokenContract = await FakeTokenContract.deploy();
    
    const StakingContract = await ethers.getContractFactory("Staking");
    stakingContract = await StakingContract.deploy(stakingTokenContract.address, rewardTokenContract.address);
    
    [owner] = await ethers.getSigners();

    await stakingTokenContract.deployed();
    await rewardTokenContract.deployed();
    await stakingContract.deployed();

    await rewardTokenContract.transfer(stakingContract.address, 1_000_000_000_000);
  })

  it("Check fail on zero coin staking", async function () {
    await expect(stakingContract.stake(0)).to.be.revertedWith("Unable to stake 0 tokens");
  });

  it("Check that user cant unstake during cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    await stakingContract.stake(stakingAmont);
    await expect(stakingContract.unstake()).to.be.revertedWith("No tokens available");
  });

  it("Check that user cant get reward during cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    await stakingContract.stake(stakingAmont);
    await expect(stakingContract.claim()).to.be.revertedWith("No reward available");
  });

  //             

  it("Check that user can unstake after cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);
    const initialBalance = await stakingTokenContract.balanceOf(owner.address);
    await stakingContract.stake(stakingAmont);

    const balanceAfterStake = await stakingTokenContract.balanceOf(owner.address);

    expect(initialBalance.sub(balanceAfterStake)).to.equal(stakingAmont);

    await network.provider.send("evm_increaseTime", [60 * 20]); // Add 20 minutes
    await stakingContract.unstake();

    const balanceAfterUnStake = await stakingTokenContract.balanceOf(owner.address);
    expect(balanceAfterUnStake).to.equal(initialBalance);
  });


  it("Check that user can get reward after cooldown", async function () {
    await stakingTokenContract.approve(stakingContract.address, stakingAmont);

    const initialReward = await rewardTokenContract.balanceOf(owner.address);
    await stakingContract.stake(stakingAmont);

    const rewardAfterStake = await rewardTokenContract.balanceOf(owner.address);

    expect(initialReward).to.equal(rewardAfterStake);

    await network.provider.send("evm_increaseTime", [60 * 10]); // Add 10 minutes
    await stakingContract.claim();

    const rewardAfterUnStake = await rewardTokenContract.balanceOf(owner.address);
    expect(rewardAfterUnStake > initialReward);
  });
  
});
