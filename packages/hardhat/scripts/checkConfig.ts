import { ethers } from "hardhat";

async function main() {
  const address = "0xde33E2d0b0a10c0492Eb456C294589ceDcbB349f";
  const contract = await ethers.getContractAt("CipherLoot", address);
  const [precision, srCutoff, ssrCutoff] = await contract.getProbabilityConfig();
  console.log("precision", precision.toString(), "sr", srCutoff.toString(), "ssr", ssrCutoff.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
