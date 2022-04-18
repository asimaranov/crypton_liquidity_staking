# Liquidity adding & liquidity token staking project

This project allows you to create liquidity pool for your tokens of add eth liquidity. And then stake given liquidity pool token

## AddLiquidity
Contract addresses:
  - Rinkeby: `0xf2Ace66af702Ecc8684C846fbF59B1D3780758D1`
  - Ropsten: `0xbe3E2DF9512d5B7e131BEf90f29FC144E6482A89`

Verification: https://ropsten.etherscan.io/address/0xbe3E2DF9512d5B7e131BEf90f29FC144E6482A89#code

How to deploy:
```shell
npx hardhat run scripts/deploy_add_liquidity.ts --network ropsten
```

How to add liquidity for token pair:
```shell
npx hardhat addLiquidity --contract-addr 0xf2Ace66af702Ecc8684C846fbF59B1D3780758D1 --token-a-addr 0x74CdFDa0e43a11772dca104392B519b2a2C46091 --token-b-addr 0x987f78596263cDcAaA015E9221dAEbcF7309f8BF --token-a-amount 0.001 --token-b-amount 0.001 --network rinkeby
```

How to add eth liquidity:
```shell
npx hardhat addLiquidityEth --contract-addr 0xf2Ace66af702Ecc8684C846fbF59B1D3780758D1 --token-addr 0x74CdFDa0e43a11772dca104392B519b2a2C46091 --eth-amount 0.001 --token-amount 0.001 --network rinkeby
```



