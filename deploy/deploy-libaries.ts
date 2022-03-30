module.exports = async ({ ethers, getNamedAccounts, deployments }) => {
    const { deploy } = deployments

    const { log } = deployments
    const namedAccounts = await getNamedAccounts()
    const { deployer } = namedAccounts

    let deployResult = await deploy("CreateCall", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })
    if (deployResult.newlyDeployed) {
        log(
            `contract CreateCall deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        )
    }

    deployResult = await deploy("MultiSend", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })
    if (deployResult.newlyDeployed) {
        log(
            `contract MultiSend deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        )
    }

    deployResult = await deploy("MultiSendCallOnly", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })
    if (deployResult.newlyDeployed) {
        log(
            `contract MultiSendCallOnly deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        )
    }
}
module.exports.tags = ["libraries"]
