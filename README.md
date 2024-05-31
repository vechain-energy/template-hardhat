# Commands

- `yarn build` – Compile Contracts
- `yarn test` – Run Tests
- `yarn deploy` – Run Deploy Scripts
- `yarn test:watch` – Run Tests in Watch Mode (run when files change)
- `yarn coverage` – Display Code Coverage
- `yarn typechain` – Update Types

# Get Started

- `contracts/` contains all Solidity files to get your project started
- `.env*` is for managing environment variables, especially deployment keys
- `deploy/` is for deployment scripts using [hardhat-deploy](https://github.com/wighawag/hardhat-deploy/blob/master/README.md)
- `deployments/` contains an archived list of deployed contracts, grouped by network
- `test/` is for testing your contracts

## Generate your own Private Keys

For example, run the following command to generate a new random wallet:

```bash
echo "PRIVATE_KEY=0x$(openssl rand -hex 32)" > .env.production
```

- `PRIVATE_KEY` refers to your wallet used for deploying and upgrading the contracts.
- Storing the details in `.env.production` creates a new environment named production.

## Encrypt your private keys

```shell
npx dotenvx encrypt
```

The output will look similar to this:

```bash
$ npx dotenvx encrypt
Update available 0.20.0 → 0.32.0 [see changelog](dotenvx.com/changelog)
✔ encrypted to .env.vault (.env,.env.example,.env.production)
ℹ commit .env.vault to code: [git commit -am ".env.vault"]
✔ key added to .env.keys (DOTENV_KEY_PRODUCTION)
ℹ push .env.keys up to hub: [dotenvx hub push]
ℹ run [DOTENV_KEY='dotenv://:key_d2765b31f83ee454c369fb5a29b72d7bf4cdd08e2280618f892b24afb209671d@dotenvx.com/vault/.env.vault?environment=production' dotenvx run -- yourcommand] to test decryption locally
```

- This process also inserts a new line into `.env.vault` containing the encrypted details.
- You may now delete `.env.production`.
- A line is added to `.env.keys` with the decryption key; **this should never be added to your git repository**.
- Ensure you back up your private key!

## Deployment

Deploy on the Vechain TestNet to check for errors using the previously mentioned `DOTENV_KEY`:

```shell
DOTENV_KEY='...' yarn deploy --network vechain_testnet
```

The output should resemble the following:

```shell
[dotenvx@0.20.0] injecting env (1) from encrypted .env.vault
[dotenv@16.4.5][INFO] Loading env from encrypted .env.vault

Generating typings for: 35 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 100 typings!
Compiled 35 Solidity files successfully (evm target: paris).
Deploying from 0x984A76543E49E751F651A65237bA1C4d7618B4A2
deploying "MyTokenUpgradeable_Implementation" (tx: 0xc846090c7feb341d407aca649b486d32c0f9a3e3952f8852e0c2f5626e3a443d)...: deployed at 0xF1A74a7B5c2B03Ae5951aAe728FA099c07dAb5A1 with 3717093 gas
deploying "MyTokenUpgradeable_Proxy" (tx: 0x4861168921f7f8ec3a665aedeb6645f60e590e61c319de68465e010afd132a4b)...: deployed at 0x49f8e1F81dF3da4d3313B429ba29C474Df12452a with 654862 gas
MyTokenUpgradeable is available at 0x49f8e1F81dF3da4d3313B429ba29C474Df12452a
```

Please take note of this line:

```shell
Deploying from 0x984A76543E49E751F651A65237bA1C4d7618B4A2
```

This is your deployment wallet, which will require VTHO to deploy the contracts. You must send VTHO to its address to enable deployment.

### Upgradable Contracts

Should your contract undergo changes, simply re-run the deployment script, and it will handle the upgrade process for you.
For more information on deployment scripts, visit [hardhat-deploy](https://github.com/wighawag/hardhat-deploy).

### Main Deployment

```shell
DOTENV_KEY='...' yarn deploy --network vechain_mainnet
```

If the deployment fails with:

```
...403 post transactions: tx rejected: insufficient energy {"code":-32000} ProviderRpcError: 403 post transactions: tx rejected: insufficient energy
```

...then your deployment wallet requires more VTHO.


