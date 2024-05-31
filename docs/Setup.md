# Project Setup

> Documentation on how this project has been setup from scratch.

```shell
# Init Project
yarn init -y
yarn config set nodeLinker node-modules

# Init Hardhat
yarn add --dev hardhat
npx hardhat init

# Init Vechain
yarn add --dev @vechain/sdk-hardhat-plugin

# Init Dependencies & Helpers
yarn add @openzeppelin/contracts@4 @openzeppelin/contracts-upgradeable@4 @openzeppelin/hardhat-upgrades @ensdomains/ens-contracts
yarn add --dev dotenv @dotenvx/dotenvx
yarn add --dev @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers
```

```ts
import "@nomicfoundation/hardhat-toolbox";
import '@nomicfoundation/hardhat-ethers';
import '@vechain/sdk-hardhat-plugin';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'dotenv/config';

if (!process.env.PRIVATE_KEY) {
  throw new Error('Please set your PRIVATE_KEY in a .env file or in your environment variables');
}

const accounts = [
  process.env.PRIVATE_KEY, // deployer
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.PRIVATE_KEY, // proxyOwner
  process.env.OWNER_PRIVATE_KEY ?? process.env.PRIVATE_KEY, // owner
];

// see https://github.com/wighawag/hardhat-deploy?tab=readme-ov-file#1-namedaccounts-ability-to-name-addresses
// references the index from the accounts list above, can be configured by network too
const namedAccounts = {
  deployer: { default: 0 },
  proxyOwner: { default: 1 },
  owner: { default: 2 },
};

const config = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 10000000
    },
    vechain_testnet: {
      url: "https://node-testnet.vechain.energy",
      accounts,
      restful: true,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,

      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegator: {
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/90"
      },
      enableDelegation: true,
      loggingEnabled: true,
    },
    vechain_mainnet: {
      url: "https://node-mainnet.vechain.energy",
      accounts,
      restful: true,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
    },
  },
  namedAccounts
};

export default config;
```

# Deploy

Private keys are sourced from environment variables. By default, the `.env` file is utilized (refer to `.env.example` for an example). Encryption is facilitated through [dotenvx](https://www.npmjs.com/package/dotenv#-manage-multiple-environments) and is enabled by setting the environment variable `DOTENV_KEY`.

**Deploy to Vechain TestNet:**

```shell
yarn deploy --network vechain_testnet
```

**Deploy to the Vechain TestNet, specifying deploy scripts by tag:**

```shell
yarn deploy --network vechain_testnet --tags <tag>
```

**Deploy to Vechain MainNet using an encrypted vault:**

```shell
DOTENV_KEY=<key> yarn deploy --network vechain_testnet --tags <tag>
```

**Use custom environment files:**

```shell
npx dotenvx run --env-file=<env file> -- npx hardhat deploy --network vechain_testnet
```

_read more about dotenvx on https://www.npmjs.com/package/dotenv#-manage-multiple-environments_

## .env Vault

- `npx dotenv encrypt` – Encrypts your current `.env` file and stores a `.env.vault` file, which can be decoded with a secret that is print by the command
- `DOTENV_KEY=<key> npx dotenvx run -- yarn deploy` – Restores the `.env` and executes the given command
- Read more at: https://www.npmjs.com/package/dotenv#dotenv-vault-1

### Example

```shell
# encrypt your .env
$ npx dotenvx encrypt
✔ encrypted to .env.vault (.env,.env.example,.env.test)
ℹ commit .env.vault to code: [git commit -am ".env.vault"]
✔ keys added to .env.keys (DOTENV_KEY_DEVELOPMENT,DOTENV_KEY_EXAMPLE,DOTENV_KEY_TEST)
ℹ push .env.keys up to hub: [dotenvx hub push]
ℹ run [DOTENV_KEY='dotenv://:key_63d249a48829f1918817babcdf6432acdbad12a0e37e1dd41a1964c9afbed0ba@dotenvx.com/vault/.env.vault?environment=test' dotenvx run -- yourcommand] to test decryption locally

# delete .env for testing purpose
$ rm .env

# restore .env with DOTENV_KEY as encryption key
# .env.vault can be checked into your repo
$ DOTENV_KEY='dotenv://:key_63d249a48829f1918817babcdf6432acdbad12a0e37e1dd41a1964c9afbed0ba@dotenvx.com/vault/.env.vault?environment=test' npx dotenvx run -- yarn deploy
[dotenvx@0.20.0] injecting env (3) from encrypted .env.vault
[dotenv@16.4.5][INFO] Loading env from encrypted .env.vault
Nothing to compile
No need to generate any newer typings.
reusing "MyTokenUpgradeable_Implementation" at 0x481c1d93B5E3F563bA76Af878b186f22C3b91B89
Owner already has UPGRADER_ROLE
MyTokenUpgradeable is available at 0x1cD719Cb3C02f5c6b83F8b342075A6EE52b9C166
Syncing name for 0x0c8c789a88b22B80225c272E021b881833114eA1 to nft.insecure.demo.vet, owned by 0xa9B9001aA9182B999D2c05FA5616590C7212F919
```
