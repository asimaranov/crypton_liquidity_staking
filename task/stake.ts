import { task } from "hardhat/config";

task("stake", "Stake tokens")
    .addParam("contractAddr", "Address of the deployed staking contract", "0x401B31DBb5B05f28b6A4f163a4c8818DC9e68B1f")
    .addParam("tokenAddr", "Address of token", "0xf1C80DE1bb14aC337808A83b0e56A53425D72B67")
    .addParam("tokenAmount", "Amount of token", "1.0")

    .setAction(async (taskArgs, hre) => {

        const StakingContract = await hre.ethers.getContractFactory("Staking");
        const stakingContract = StakingContract.attach(taskArgs['contractAddr']);
        await stakingContract.stake(hre.ethers.utils.parseEther(taskArgs['tokenAmount']));
        
    });

