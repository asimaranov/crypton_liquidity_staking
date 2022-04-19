import { task } from "hardhat/config";

task("claim", "Claim tokens")
    .addParam("contractAddr", "Address of the deployed staking contract", "0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6")

    .setAction(async (taskArgs, hre) => {

        const stakingContract = await hre.ethers.getContractAt("Staking", taskArgs['contractAddr']);

        const claimTransaction = await stakingContract.claim().catch(err => console.log(err.error));
        const rc = await claimTransaction!.wait();

        const claimedEvent = rc.events!.find(e => e.event == 'Claimed');
        const [amount] = claimedEvent!.args!;

        console.log(
            `Successfully claimed ${hre.ethers.utils.formatEther(amount)} tokens`
        );

    });

