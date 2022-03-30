import { ethers, getNamedAccounts, deployments } from "hardhat"
import { AddressZero } from "@ethersproject/constants"

import { calculateProxyAddress } from "./utils/proxies"

async function main() {
    const { get, execute } = deployments

    const namedAccounts = await getNamedAccounts()
    const { deployer } = namedAccounts

    const compatibilityFallbackHandlerDeployment = await get("CompatibilityFallbackHandler")
    const gnosisSafeProxyFactoryDeployment = await get("GnosisSafeProxyFactory")
    const gnosisSafeProxyFactory = await ethers.getContractAt(
        gnosisSafeProxyFactoryDeployment.abi,
        gnosisSafeProxyFactoryDeployment.address
    )
    const gnosisSafeDeployment = await get("GnosisSafe")
    const gnosisSafeFacory = await ethers.getContractFactory("GnosisSafe")
    
    const setupData = gnosisSafeFacory.interface.encodeFunctionData("setup", [
        [
            deployer,
            "0xfdf9609f5ee6f3104d48f60d3ae6be0c9fc424d9",
        ], // owners
        1, // threshold
        AddressZero, // to
        "0x", // data
        compatibilityFallbackHandlerDeployment.address, // fallbackHandler,
        AddressZero, // paymentToken,
        0, // payment,
        AddressZero // paymentReceiver
    ])

    const saltNonce = new Date().getTime();
    const proxyAddress = await calculateProxyAddress(gnosisSafeProxyFactory, gnosisSafeDeployment.address, setupData, saltNonce)
    const createWalletResult = await execute('GnosisSafeProxyFactory', {
        from: deployer,
        log: true,
        gasLimit: 1000000,
    }, 'createProxyWithNonce', gnosisSafeDeployment.address, setupData, saltNonce)

    console.log(`GnosisSafe wallet ${proxyAddress} created at ${createWalletResult.transactionHash}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
