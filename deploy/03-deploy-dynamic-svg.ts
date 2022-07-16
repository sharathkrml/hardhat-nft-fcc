import { ContractReceipt } from "ethers"
import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
import fs from "fs"
let priceFeedAddress = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
const deploySvgNft = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const lowSvg = `<?xml version='1.0' standalone='no'?><svg width='1024px' height='1024px' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'><path fill='#333' d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'/><path fill='#E6E6E6' d='M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zM288 421a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm376 272h-48.1c-4.2 0-7.8-3.2-8.1-7.4C604 636.1 562.5 597 512 597s-92.1 39.1-95.8 88.6c-.3 4.2-3.9 7.4-8.1 7.4H360a8 8 0 0 1-8-8.4c4.4-84.3 74.5-151.6 160-151.6s155.6 67.3 160 151.6a8 8 0 0 1-8 8.4zm24-224a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z'/><path fill='#333' d='M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm224 112c-85.5 0-155.6 67.3-160 151.6a8 8 0 0 0 8 8.4h48.1c4.2 0 7.8-3.2 8.1-7.4 3.7-49.5 45.3-88.6 95.8-88.6s92 39.1 95.8 88.6c.3 4.2 3.9 7.4 8.1 7.4H664a8 8 0 0 0 8-8.4C667.6 600.3 597.5 533 512 533zm128-112a48 48 0 1 0 96 0 48 48 0 1 0-96 0z'/></svg>`
    const highSvg = `<svg viewBox='0 0 200 200' width='400'  height='400' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' fill='yellow' r='78' stroke='black' stroke-width='3'/><g class='eyes'><circle cx='61' cy='82' r='12'/><circle cx='127' cy='82' r='12'/></g><path d='m136.81 116.53c.69 26.17-64.11 42-81.52-.73' style='fill:none; stroke: black; stroke-width: 3;'/></svg>`
    let args = [priceFeedAddress, lowSvg, highSvg]
    const SvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: 1,
    })
    if (!developmentChains.includes(network.name)) {
        log("verifying..............")
        await verify(SvgNft.address, args)
    }
    log("--------------------------------")
}
export default deploySvgNft
deploySvgNft.tags = ["all", "svg"]
