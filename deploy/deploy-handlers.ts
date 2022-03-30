module.exports = async ({ ethers, getNamedAccounts, deployments }) => {
    const { deploy } = deployments

    const { log } = deployments
    const namedAccounts = await getNamedAccounts()
    const { deployer } = namedAccounts

    let deployResult = await deploy("DefaultCallbackHandler", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })
    if (deployResult.newlyDeployed) {
        log(
            `contract DefaultCallbackHandler deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        )
    }

    deployResult = await deploy("CompatibilityFallbackHandler", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
    })
    if (deployResult.newlyDeployed) {
        log(
            `contract CompatibilityFallbackHandler deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        )
    }
}
module.exports.tags = ["handlers"]
