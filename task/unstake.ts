import { task } from "hardhat/config";

task("unstake", "Unstake tokens")
    .addParam("contractAddr", "Address of the deployed staking contract", "0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6")

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

