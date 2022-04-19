# Liquidity adding & liquidity token staking project

This project allows you to create liquidity pool for your tokens of add eth liquidity. And then stake given liquidity pool token

## AddLiquidity
Contract addresses:
  - Rinkeby: `0x533f0f27029bB7A5713F5896CD55219DF4D934A0`

Verification: https://rinkeby.etherscan.io/address/0x533f0f27029bB7A5713F5896CD55219DF4D934A0#code

How to verify:
```shell
npx hardhat verify 0x533f0f27029bB7A5713F5896CD55219DF4D934A0 --network rinkeby
```

How to deploy:
```shell
npx hardhat run scripts/deploy_add_liquidity.ts --network rinkeby
```

How to add liquidity for token pair:
```shell
npx hardhat addLiquidity --contract-addr 0x533f0f27029bB7A5713F5896CD55219DF4D934A0 --token-a-addr 0x74CdFDa0e43a11772dca104392B519b2a2C46091 --token-b-addr 0x987f78596263cDcAaA015E9221dAEbcF7309f8BF --token-a-amount 0.001 --token-b-amount 0.001 --network rinkeby
```

How to add eth liquidity:
```shell
npx hardhat addLiquidityEth --contract-addr 0x533f0f27029bB7A5713F5896CD55219DF4D934A0 --token-addr 0x74CdFDa0e43a11772dca104392B519b2a2C46091 --eth-amount 0.001 --token-amount 0.001 --network rinkeby
```


## Staking
Contract addresses:
 - Rinkeby: `0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6`

Verification: https://rinkeby.etherscan.io/address/0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6#code

How to verify:
```shell
npx hardhat verify 0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6 --network rinkeby 0xf1C80DE1bb14aC337808A83b0e56A53425D72B67 0xc8eeF11F258158d2B9981DD4cE305eACF33Bf8b6
```

How to deploy:
```shell
npx hardhat run scripts/deploy_staking.ts --network rinkeby
```

How to stake: 
```shell
npx hardhat stake --contract-addr 0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6 --token-addr 0xf1C80DE1bb14aC337808A83b0e56A53425D72B67 --token-amount 0.0000000001 --network rinkeby
```

How to unstake: 
```shell
npx hardhat unstake --contract-addr 0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6 --network rinkeby
```

How to claim: 
```shell
npx hardhat claim --contract-addr 0x091319EC612ab0CF15Ba09A8627fF0967fDD98B6 --network rinkeby
```