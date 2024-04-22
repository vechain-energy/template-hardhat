import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

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
    const ugpraderRole = await hre.deployments.read('MyTokenUpgradeable', {}, 'UPGRADER_ROLE');
    if (!(await hre.deployments.read('MyTokenUpgradeable', {}, 'hasRole', ugpraderRole, owner))) {

        console.log('Granting owner UPGRADER_ROLE');
        // execute a function of the deployed contract
        await hre.deployments.execute(
            'MyTokenUpgradeable',
            { from: deployer },
            'grantRole',
            ugpraderRole,
            owner
        );
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
