import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { MyToken } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // get access to your named accounts, check hardhat.config.ts on your configuration
    const { deployer, owner } = await hre.getNamedAccounts();

    // deploy a contract, it will automatically deploy again when the code changes
    await hre.deployments.deploy('MyToken', {
        from: deployer
    })

    // get an ethers instance for interaction with the contract
    const contract = await hre.ethers.getContract('MyToken') as MyToken;

    // example for reading and changing data
    const currentOwner = await contract.owner()
    if (currentOwner !== owner) {
        console.log('Transferring Ownership to', owner)
        await contract.transferOwnership(owner)
    }

};

func.id = 'mytoken'; // name your deployment
func.tags = ['regular']

export default func;
