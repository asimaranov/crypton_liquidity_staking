import { task } from "hardhat/config";

task("addLiquidity", "Add liquidity to the uniswap ").addParam("contractAddr", "Address of the deployed contract")
    .setAction(async (taskArgs, hre) => {
        let [owner] = await hre.ethers.getSigners();

        const amountA = hre.ethers.utils.parseEther("1.0");
        const amountB = hre.ethers.utils.parseEther("1.0");

        const AddLiquidityContract = await hre.ethers.getContractFactory("AddLiquidity");
        
        const tokenAContract = await hre.ethers.getContractAt("ERC20", '0x90556C343650C3ae2e5700f139dAde3c1C9Cb82E');
        const tokenBContract = await hre.ethers.getContractAt("ERC20", '0xfad5b47636EFC4F695343BDf31605B8bA7aA09FE');

        console.log('Owner balance:', await tokenAContract.balanceOf(owner.address));
        console.log('Approving ', amountA, 'for', taskArgs['contractAddr']);

        const approveATransaction = await tokenAContract.approve(taskArgs['contractAddr'], amountA);
        const approveBTransaction = await tokenBContract.approve(taskArgs['contractAddr'], amountB);

        await approveATransaction.wait();
        await approveBTransaction.wait();


        const addLiquidityContract = AddLiquidityContract.attach(taskArgs['contractAddr']);


        console.log('Allowance of token a:', await tokenAContract.allowance(owner.address, taskArgs['contractAddr']))
        console.log('Allowance of token b:', await tokenBContract.allowance(owner.address, taskArgs['contractAddr']))

        const addLiquidityTransaction = await addLiquidityContract.addLiquidity(
            tokenAContract.address, tokenBContract.address, hre.ethers.utils.parseEther("1.0"), hre.ethers.utils.parseEther("1.0")
        );

        const rc = await addLiquidityTransaction.wait();

        console.log(`Transaction result:`, rc);
    });

