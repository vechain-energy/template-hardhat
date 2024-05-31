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