import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { DeployFunction } from 'hardhat-deploy/types';
import type { MyTokenUpgradeable } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer, proxyOwner, owner } = await hre.getNamedAccounts();

    console.log('Deploying from', deployer)

    // deploy a proxied contract
    await hre.deployments.deploy('MyTokenUpgradeable', {
        from: deployer,
        contract: 'MyTokenUpgradeable',
        log: true,
        proxy: {
            owner: proxyOwner,
            proxyContract: 'UUPS',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [],
                }
            },
        },
        libraries: {
        },
    });

    // read data from contract
    const contract = await hre.ethers.getContract('MyTokenUpgradeable', proxyOwner) as MyTokenUpgradeable

    // get role identifier
    const ugpraderRole = await contract.UPGRADER_ROLE()

    // check role for owner
    if (!(await contract.hasRole(ugpraderRole, owner))) {
        console.log('Granting owner UPGRADER_ROLE');

        // execute a function of the deployed contract
        // .wait() waits for the receipts and throws if it reverts
        await (await contract.grantRole(ugpraderRole, owner)).wait()
    }
    else {
        console.log('Owner already has UPGRADER_ROLE');
    }

    // access deployed address
    const MyTokenUpgradeable = await hre.deployments.get('MyTokenUpgradeable');
    console.log('MyTokenUpgradeable is available at', MyTokenUpgradeable.address)
};

func.id = 'mytoken-upgradeable'; // name your deployment
func.tags = ['upgradeable']; // tag your deployment, to run certain tags only
func.dependencies = ['regular']; // build a dependency tree based on tags, to run deployments in a certain order

export default func;
