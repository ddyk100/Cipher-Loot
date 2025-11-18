import { expect } from "chai";
import { loadFixture, mine } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("CipherLoot", function () {
  async function deployFixture() {
    const [deployer, alice] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("CipherLoot");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    return { contract, deployer, alice };
  }

  it("stores encrypted draws and emits events", async function () {
    const { contract, deployer } = await loadFixture(deployFixture);

    const tx = await contract.connect(deployer).draw();
    await expect(tx).to.emit(contract, "LootDrawn");
    await tx.wait();

    expect(await contract.getDrawCount(deployer.address)).to.equal(1);
    expect(await contract.totalDraws()).to.equal(1);

    const [rarity, variant, timestamp] = await contract.getEncryptedResult(deployer.address, 1);
    expect(rarity).to.not.equal(ethers.ZeroHash);
    expect(variant).to.not.equal(ethers.ZeroHash);
    expect(timestamp).to.be.gt(0);
  });

  it("supports pagination helpers", async function () {
    const { contract, deployer } = await loadFixture(deployFixture);

    await contract.draw();
    await mine(1);
    await contract.draw();

    const { drawId } = await contract.getLatestEncryptedResult(deployer.address);
    expect(drawId).to.equal(2n);

    const [rarities, variants, timestamps] = await contract.getEncryptedHistory(deployer.address, 0, 10);
    expect(rarities.length).to.equal(2);
    expect(variants.length).to.equal(2);
    expect(timestamps.length).to.equal(2);
  });

  it("reverts for invalid draw ids", async function () {
    const { contract, deployer } = await loadFixture(deployFixture);

    await expect(contract.getEncryptedResult(deployer.address, 1)).to.be.revertedWithCustomError(
      contract,
      "InvalidDrawId"
    );
  });
});


