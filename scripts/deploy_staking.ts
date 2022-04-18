import { ethers } from "hardhat";

async function main() {
  const AddLiquidityContract = await ethers.getContractFactory("Staking");
  const addLiquidityContract = await AddLiquidityContract.deploy("0xf1C80DE1bb14aC337808A83b0e56A53425D72B67", "0xc8eeF11F258158d2B9981DD4cE305eACF33Bf8b6");

  await addLiquidityContract.deployed();

  console.log("Contract deployed to:", addLiquidityContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
