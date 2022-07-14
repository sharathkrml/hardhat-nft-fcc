import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"
const deployToken = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() // from hardhat.config.js
    const chainId = network.config.chainId!
    if (developmentChains.includes(network.name)) {
        log("local network detected,deploying mocks!!")
    }
    const ourToken = await deploy("OurToken", {
        from: deployer,
        log: true,
        args: [networkConfig[chainId]["initialSupply"]],
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
        log("erfiying...........................................")
        await verify(ourToken.address, [networkConfig[chainId]["initialSupply"]])
    }
}
export default deployToken
deployToken.tags = ["all"]
