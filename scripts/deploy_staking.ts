import { ethers } from "hardhat";

async function main() {
  const StakingContract = await ethers.getContractFactory("Staking");

  const stakingTokenAddr = "0xf1C80DE1bb14aC337808A83b0e56A53425D72B67";
  const rewardTokenAddr = "0xc8eeF11F258158d2B9981DD4cE305eACF33Bf8b6";

  const rewardTokenContract = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", rewardTokenAddr);

  const stakingContract = await StakingContract.deploy(stakingTokenAddr, rewardTokenAddr);
  await stakingContract.deployed();

  await rewardTokenContract.approve(stakingContract.address, ethers.utils.parseEther("1.0"));

  console.log("Contract deployed to:", stakingContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
