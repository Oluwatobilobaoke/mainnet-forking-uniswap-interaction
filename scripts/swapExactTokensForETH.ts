import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const amountIn = ethers.parseUnits("50000", 6);
  const amountOutMin = ethers.parseUnits("17", 18);

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const WETH = await ethers.getContractAt("IERC20", WETHAddress);

  const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

  const approveTx = await USDC.connect(impersonatedSigner).approve(
    UNIRouter,
    amountIn
  );
  await approveTx.wait();

  const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
  const wethBal = await WETH.balanceOf(impersonatedSigner.address);
  let ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);

  console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
  console.log("WETH Balance:", ethers.formatUnits(wethBal, 18));
  console.log("ETH Balance:", ethers.formatUnits(ethBal, 18));

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const swapTx = await ROUTER.connect(impersonatedSigner).swapExactTokensForETH(
    amountIn,
    amountOutMin,
    [USDCAddress, WETHAddress],
    impersonatedSigner.address,
    deadline
  );

  await swapTx.wait();

  console.log("Swap Transaction Hash:", swapTx.hash);

  const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
  const wethBalAfterSwap = await WETH.balanceOf(impersonatedSigner.address);
  ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);

  console.log(
    "-----------------------------------------------------------------"
  );

  console.log(
    "usdc balance after swap",
    ethers.formatUnits(usdcBalAfterSwap, 6)
  );
  console.log(
    "WETH balance after swap",
    ethers.formatUnits(wethBalAfterSwap, 18)
  );
  console.log("ETH Balance after swap:", ethers.formatUnits(ethBal, 18));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// swapExactTokensForETH
// function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
//   external
//   returns (uint[] memory amounts);
// Swaps an exact amount of tokens for as much ETH as possible, along the route determined by the path.
// The first element of path is the input token, the last must be WETH, and
//  any intermediate elements represent intermediate pairs to trade through(if, for example, a direct pair does not exist).

// If the to address is a smart contract, it must have the ability to receive ETH.

// USDC Balance: 23188435.255046
// WETH Balance: 2153.030665
// ETH Balance: 9850.323688426317325823

// usdc balance after swap 23138435.255046
// WETH balance after swap 2153.030665
// ETH Balance after swap: 9867.409053629643079804

// USDC before TXN = 23188435.255046; USDC after TXN = 23138435.255046; USDC difference = 50000;
// ETH before TXN = 9850.323688426317325823; ETH after TXN = 9867.409053629643079804; ETH difference = 17.085365203325753981;
