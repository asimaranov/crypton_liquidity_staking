import { ethers } from "hardhat";

async function main() {
  const AddLiquidityContract = await ethers.getContractFactory("Staking");
  const addLiquidityContract = await AddLiquidityContract.deploy();

  await addLiquidityContract.deployed();

  console.log("Contract deployed to:", addLiquidityContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
