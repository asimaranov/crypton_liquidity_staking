import { task } from "hardhat/config";

task("addLiquidity", "Add liquidity to the uniswap ")
    .addParam("contractAddr", "Address of the deployed contract", "0x401B31DBb5B05f28b6A4f163a4c8818DC9e68B1f")
    .addParam("tokenAAddr", "Address of token", "0xEde64552FbfF05c7dc076468c3a70C6B17CB5a37")
    .addParam("tokenBAddr", "Address of token", "0x6c798973bC66aa4556251e21058f89C942F45dC7")
    .addParam("tokenAAmount", "Amount of token A to put into liquidity pool", "0.001")
    .addParam("tokenBAmount", "Amount of token B to put into liquidity pool", "0.001")
    
    .setAction(async (taskArgs, hre) => {
        const amountA = hre.ethers.utils.parseEther(taskArgs['tokenAAmount']);
        const amountB = hre.ethers.utils.parseEther(taskArgs['tokenBAmount']);

        const AddLiquidityContract = await hre.ethers.getContractFactory("AddLiquidity");

        const tokenAContract = await hre.ethers.getContractAt("ERC20", taskArgs['tokenAAddr']);
        const tokenBContract = await hre.ethers.getContractAt("ERC20", taskArgs['tokenBAddr']);

        const approveATransaction = await tokenAContract.approve(taskArgs['contractAddr'], amountA);
        const approveBTransaction = await tokenBContract.approve(taskArgs['contractAddr'], amountB);

        await approveATransaction.wait();
        await approveBTransaction.wait();

        const addLiquidityContract = AddLiquidityContract.attach(taskArgs['contractAddr']);

        const addLiquidityTransaction = await addLiquidityContract.addLiquidity(
            tokenAContract.address, tokenBContract.address, amountA, amountB
        );
        const rc = await addLiquidityTransaction.wait();

        const newAmountAEvent = rc.events!.find(event => event.event === 'NewAmountA')!;
        const newAmountBEvent = rc.events!.find(event => event.event === 'NewAmountB')!;
        const newLiquidityEvent = rc.events!.find(event => event.event === 'NewLiquidity')!;
        const lpTokenAddress = rc.events!.find(event => event.event === 'LPTokenAddress')!;

        console.log(`New token a amount: ${newAmountAEvent.args![0]}, new token b amount: ${newAmountBEvent.args![0]}, new liquidity ${newLiquidityEvent.args![0]}. Lp token address: ${lpTokenAddress.args![0]}`);

    });

