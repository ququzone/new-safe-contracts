import { Interface } from "ethers/lib/utils"
import { ethers } from "hardhat"

import { GnosisSafe } from "../types/GnosisSafe"
import ERC20 from "./abis/ERC20"
import { buildSafeTransaction, executeTx, safeSignMessage } from "./utils/execution"

async function main() {
    const [deployer] = await ethers.getSigners()

    const gnosisSafeFacory = await ethers.getContractFactory("GnosisSafe")
    const wallet = gnosisSafeFacory.attach(process.env.WALLET!) as GnosisSafe

    const ERC20Interface = new Interface(ERC20)
    const transferData = ERC20Interface.encodeFunctionData(
        "transfer", [
            deployer.address,
            ethers.utils.parseEther("2")
        ]
    )
    
    const tx = buildSafeTransaction({
        to: "0xf00173337b2720578b4cb715fe4b8f71b77f7112",
        data: transferData,
        operation: 0,
        nonce: (await wallet.nonce()).toNumber(),
        // safeTxGas: 1000000
    })
    const result = await executeTx(wallet, tx, [await safeSignMessage(deployer, wallet, tx)])

    console.log(`Execute contract success at ${result.hash}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
