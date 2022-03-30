import { ethers } from "hardhat"

import { GnosisSafe } from "../types/GnosisSafe"
import { buildSafeTransaction, executeTx, safeSignMessage } from "./utils/execution"

async function main() {
    const [deployer] = await ethers.getSigners()

    const gnosisSafeFacory = await ethers.getContractFactory("GnosisSafe")
    const wallet = gnosisSafeFacory.attach(process.env.WALLET!) as GnosisSafe
    
    const tx = buildSafeTransaction({
        to: deployer.address, 
        value: ethers.utils.parseEther("1"),
        operation: 0,
        nonce: (await wallet.nonce()).toNumber(),
        // safeTxGas: 1000000
    })
    const result = await executeTx(wallet, tx, [await safeSignMessage(deployer, wallet, tx)])

    console.log(`Transfer native at ${result.hash}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
