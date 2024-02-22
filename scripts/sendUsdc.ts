import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function sendUsdc() {
  const WHALEADDY = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
  const UsdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  await helpers.impersonateAccount(WHALEADDY);
  const impersonatedSigner = await ethers.getSigner(WHALEADDY);

  const usdcContract = await ethers.getContractAt(
    "IERC20",
    UsdcContractAddress
  );

  const [otherAccount] = await ethers.getSigners();

  console.log("Other Account Address : ", otherAccount.address);

  const amountToTransfer = ethers.parseUnits("22154140", 6);

  let whaleBalance = await usdcContract.balanceOf(WHALEADDY);
  let otherBalance = await usdcContract.balanceOf(otherAccount.address);

  console.log(
    "Whale Account Balance before transaction : ",
    ethers.formatUnits(whaleBalance, 6)
  );

  console.log(
    "Other Account Balance before transaction : ",
    ethers.formatUnits(otherBalance, 6)
  );

  await usdcContract
    .connect(impersonatedSigner)
    .transfer(otherAccount.address, amountToTransfer);

  whaleBalance = await usdcContract.balanceOf(WHALEADDY);
  otherBalance = await usdcContract.balanceOf(otherAccount.address);

  console.log(
    "Whale Account Balance after transaction  : ",
    ethers.formatUnits(whaleBalance, 6)
  );

  console.log(
    "Other Account Balance before transaction : ",
    ethers.formatUnits(otherBalance, 6)
  );
}

sendUsdc()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
