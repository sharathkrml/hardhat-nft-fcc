import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DECIMALS, INITIAL_PRICE, developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const deployMocks = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (chainId == 31337) {
        log("Local network!!,deplying mocks")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
    }
}
export default deployMocks
deployMocks.tags = ["all", "mock", "main"]
