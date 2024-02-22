import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const amountOut = ethers.parseUnits("3000", 6);
  const amountInMax = ethers.parseUnits("4000", 18);

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const DAI = await ethers.getContractAt("IERC20", DAIAddress);

  const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

  const approveTx = await DAI.connect(impersonatedSigner).approve(
    UNIRouter,
    amountInMax
  );
  await approveTx.wait();

  const ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);

  const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
  const daiBal = await DAI.balanceOf(impersonatedSigner.address);

  console.log("ETH Balance:", ethers.formatUnits(ethBal, 18));
  console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
  console.log("DAI Balance:", ethers.formatUnits(daiBal, 18));

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const swapTx = await ROUTER.connect(
    impersonatedSigner
  ).swapTokensForExactTokens(
    amountOut,
    amountInMax,
    [DAIAddress, USDCAddress],
    impersonatedSigner.address,
    deadline
  );

  await swapTx.wait();

  const ethBalAfterSwap = await impersonatedSigner.provider.getBalance(
    USDCHolder
  );

  const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalAfterSwap = await DAI.balanceOf(impersonatedSigner.address);

  console.log(
    "-----------------------------------------------------------------"
  );

  console.log(
    "eth balance after swap",
    ethers.formatUnits(ethBalAfterSwap, 18)
  );

  console.log(
    "usdc balance after swap",
    ethers.formatUnits(usdcBalAfterSwap, 6)
  );
  console.log(
    "dai balance after swap",
    ethers.formatUnits(daiBalAfterSwap, 18)
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// swapTokensForExactTokens;
// function swapTokensForExactTokens(
//   uint amountOut,
//   uint amountInMax,
//   address[] calldata path,
//   address to,
//   uint deadline
// ) external returns (uint[] memory amounts);

// Receive an exact amount of output tokens for as few input tokens as possible, along the route determined by the path.
// The first element of path is the input token, the last is the output token, and
//  any intermediate elements represent intermediate tokens to trade through(if, for example, a direct pair does not exist).

// msg.sender should have already given the router an allowance of at least amountInMax on the input token.

// DAI before TXN =469280.909893621436046255; DAI after TXN = 472304.018119385248019296; DAI difference = 3023.108225763812973041;
// USDC before TXN = 23191435.255046; USDC after TXN = 23188435.255046; USDC difference = 3000;

// https://etherscan.io/tx/0x8ef54749f321410988c11373c57cc6fbf1628aa874cabe62eccb8db5360bfd4f
// https://etherscan.io/tx/0x6b76b0fac8a61627db50a486483046997533fc3f7c6101d42088b9b861d0c0b7https://etherscan.io/tx/0x6b76b0fac8a61627db50a486483046997533fc3f7c6101d42088b9b861d0c0b7
