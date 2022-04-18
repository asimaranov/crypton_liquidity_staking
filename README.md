# Liquidity adding & liquidity token staking project

This project allows you to create liquidity pool for your tokens of add eth liquidity. And then stake given liquidity pool token

## AddLiquidity
Contract addresses:
  - Ropsten: `0xbe3E2DF9512d5B7e131BEf90f29FC144E6482A89`
  - Rinkeby: `TODO`

How to deploy:
```shell
npx hardhat run scripts/deploy_add_liquidity.ts --network ropsten
```

How to add liquidity for token pair:
```shell
npx hardhat addLiquidity --contract-addr 0xbe3E2DF9512d5B7e131BEf90f29FC144E6482A89 --tokenAAddr 0xEde64552FbfF05c7dc076468c3a70C6B17CB5a37 --tokenBAddr 0x6c798973bC66aa4556251e21058f89C942F45dC7 --tokenAAmount 0.001 --tokenBAmount 0.001 --network ropsten
```

How to add eth liquidity:
```shell
npx hardhat addLiquidityEth --contract-addr 0xbe3E2DF9512d5B7e131BEf90f29FC144E6482A89 --tokenAddr 0xEde64552FbfF05c7dc076468c3a70C6B17CB5a37 --ethAmount 0.001 --tokenAmount 0.001 --network ropsten
```



