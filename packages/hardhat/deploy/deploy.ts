import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying CipherLoot with:", deployer.address);

  const CipherLoot = await ethers.getContractFactory("CipherLoot");
  const cipherLoot = await CipherLoot.deploy();
  await cipherLoot.waitForDeployment();

  console.log("✨ CipherLoot deployed to:", await cipherLoot.getAddress());
}

export default main;