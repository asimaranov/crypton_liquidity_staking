import { task } from "hardhat/config";

task("unstake", "Unstake tokens")
    .addParam("contractAddr", "Address of the deployed staking contract", "0xF37E5E828f5767732376E2AC08cd4e875BdA9639")

    .setAction(async (taskArgs, hre) => {

        const stakingContract = await hre.ethers.getContractAt("Staking", taskArgs['contractAddr']);

        const unstakingTransaction = await stakingContract.unstake().catch(err => console.log(err.error));
        const rc = await unstakingTransaction!.wait();

        const unstakedEvent = rc.events!.find(e => e.event == 'Unstaked');
        const [amount] = unstakedEvent!.args!;

        console.log(
            `Successfully unstaked ${hre.ethers.utils.formatEther(amount)} tokens`
        );

    });

