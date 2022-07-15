import { ContractReceipt } from "ethers"
import { ethers, network } from "hardhat"
import { DeployResult } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { VRFCoordinatorV2Mock } from "../typechain-types"
import verify from "../utils/verify"

let tokenUris = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
]
let FUND_AMOUNT = "10000000000000000000"
const deployIPFSNFT = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log("--------------------------------")
    let vrfCoordinatorV2MockAddress, subscriptionId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2MockAddress = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txnReceipt: ContractReceipt = await tx.wait(1)
        if (txnReceipt.events) {
            if (txnReceipt.events[0].args) {
                subscriptionId = txnReceipt?.events[0].args?.subId
            }
        }
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
        log(subscriptionId)
    } else {
        vrfCoordinatorV2MockAddress = chainId && networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = chainId && networkConfig[chainId].subscriptionId
    }
    const gasLane = chainId && networkConfig[chainId].gasLane
    const callbackGasLimit = chainId && networkConfig[chainId].callbackGasLimit
    const mintFee = chainId && networkConfig[chainId].mintFee
    const args = [
        vrfCoordinatorV2MockAddress,
        subscriptionId,
        gasLane,
        callbackGasLimit,
        tokenUris,
        mintFee,
    ]
    const RandomIpfsNft: DeployResult = await deploy("RandomIpfsNft", {
        from: deployer,
        log: true,
        args: args,
    })
    if (!developmentChains.includes(network.name)) {
        log("verifying..............")
        await verify(RandomIpfsNft.address, args)
    }
    log("--------------------------------")
}
export default deployIPFSNFT
deployIPFSNFT.tags = ["all", "ipfs"]
