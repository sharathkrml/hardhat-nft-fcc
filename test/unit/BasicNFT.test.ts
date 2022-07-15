import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, network } from "hardhat"
import { BasicNFT } from "../../typechain-types"
import { assert } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
developmentChains.includes(network.name) &&
    describe("BasicNFT Unit test!!", () => {
        let basicNFT: BasicNFT
        let deployer: SignerWithAddress
        let accounts: SignerWithAddress[]
        beforeEach(async () => {
            ;[deployer, ...accounts] = await ethers.getSigners()
            await deployments.fixture(["all"])
            basicNFT = await ethers.getContract("BasicNFT", deployer)
        })
        describe("Constructor", () => {
            it("check name", async () => {
                assert.equal(await basicNFT.name(), "Dogie")
            })
            it("check symbol", async () => {
                assert.equal(await basicNFT.symbol(), "DOG")
            })
        })
        describe("tokenURI", () => {
            it("check tokenURI", async () => {
                let uri =
                    "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
                assert.equal(await basicNFT.tokenURI(1), uri)
            })
        })
        describe("mintNFT", () => {
            it("deployer mints NFT", async () => {
                let tokenCounter = await basicNFT.getTokenCounter()
                assert.equal(tokenCounter.toString(), "0")

                let tx = await basicNFT.mintNFT()
                await tx.wait()
                tokenCounter = await basicNFT.getTokenCounter()
                assert.equal(tokenCounter.toString(), "1")
            })
        })
    })
