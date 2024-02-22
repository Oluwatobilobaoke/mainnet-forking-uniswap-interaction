import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const amountIn = ethers.parseUnits("5000", 6);

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const DAI = await ethers.getContractAt("IERC20", DAIAddress);

  const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

  const approveTx = await USDC.connect(impersonatedSigner).approve(
    UNIRouter,
    amountIn
  );
  await approveTx.wait();

  const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
  const daiBal = await DAI.balanceOf(impersonatedSigner.address);

  console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
  console.log("DAI Balance:", ethers.formatUnits(daiBal, 18));

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const swapTx = await ROUTER.connect(
    impersonatedSigner
  ).swapExactTokensForTokens(
    amountIn,
    0,
    [USDCAddress, DAIAddress],
    impersonatedSigner.address,
    deadline
  );

  await swapTx.wait();

  console.log("Swap Transaction Hash:", swapTx.hash);

  const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalAfterSwap = await DAI.balanceOf(impersonatedSigner.address);

  console.log(
    "-----------------------------------------------------------------"
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

// swapExactTokensForTokens
// function swapExactTokensForTokens(
//   uint amountIn,
//   uint amountOutMin,
//   address[] calldata path,
//   address to,
//   uint deadline
// ) external returns (uint[] memory amounts);
// Swaps an exact amount of input tokens for as many output tokens as possible, along the route determined by the path.
// The first element of path is the input token, the last is the output token, and
// any intermediate elements represent intermediate pairs to trade through(if, for example, a direct pair does not exist).

// msg.sender should have already given the router an allowance of at least amountIn on the input token.


