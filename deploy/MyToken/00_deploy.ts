import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { type MyToken } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer, owner } = await hre.getNamedAccounts();
    await hre.deployments.deploy('MyToken', {
        from: deployer
    })

    const contract = await hre.ethers.getContract('MyToken') as MyToken;
    const currentOwner = await contract.owner()
    if (currentOwner !== owner) {
        console.log('Transferring Ownership to', owner)
        await contract.transferOwnership(owner)
    }

};

func.id = 'mytoken'; // name your deployment
func.tags = ['regular']

export default func;
