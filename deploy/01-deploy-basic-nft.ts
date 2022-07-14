import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployBasicNFT = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------")
    const args = [] as any[]
    const basicNFT = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })
    if (!developmentChains.includes(network.name)) {
        log("verifying..............")
        await verify(basicNFT.address, args)
    }
    log("--------------------------------")
}
export default deployBasicNFT
deployBasicNFT.tags = ["all"]
