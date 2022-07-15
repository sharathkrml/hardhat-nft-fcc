import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, network } from "hardhat"
import { RandomIpfsNft } from "../../typechain-types"
import { assert } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
developmentChains.includes(network.name) &&
    describe("RandomIpfsNft Unit test!!", () => {
        let randomIpfsNft: RandomIpfsNft
        let deployer: SignerWithAddress
        let accounts: SignerWithAddress[]
        beforeEach(async () => {
            ;[deployer, ...accounts] = await ethers.getSigners()
            await deployments.fixture(["ipfs"])
            randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
        })
        describe("Constructor", () => {
            it("check name", async () => {
                assert.equal(await randomIpfsNft.name(), "Random IPFS NFT")
            })
            it("check symbol", async () => {
                assert.equal(await randomIpfsNft.symbol(), "RIN")
            })
        })
        it("request NFT", async () => {
            let fee = await randomIpfsNft.getMintFee()
            let tx = await randomIpfsNft.requestNFT({ value: fee.toString() })
            let res = await tx.wait()

            let countRes = await new Promise(async (resolve, reject) => {
                randomIpfsNft.on("NftMinted", async () => {
                    console.log("fired NftMinted")
                    try {
                        let count = await randomIpfsNft.getTokenCounter()
                        console.log(count)
                        resolve(count)
                    } catch (e) {
                        console.log(e)
                        reject(e)
                    }
                })
            })
            console.log(countRes)
        })
    })
