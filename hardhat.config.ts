import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const MAINET_ALCHEMY_API_KEY_URL = process.env.MAINET_ALCHEMY_API_KEY_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (
  !(
    ALCHEMY_API_KEY_URL ||
    PRIVATE_KEY ||
    ETHERSCAN_API_KEY ||
    MAINET_ALCHEMY_API_KEY_URL
  )
) {
  console.log(
    "Please include ALCHEMY_API_KEY_URL, PRIVATE_KEY, and ETHERSCAN_API_KEY as env variables."
  );
  process.exit(1);
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // sepolia: {
    //   url: ALCHEMY_API_KEY_URL,
    //   //@ts-ignore
    //   accounts: [PRIVATE_KEY],
    // },
    hardhat: {
      forking: {
        //@ts-ignore
        url: MAINET_ALCHEMY_API_KEY_URL,
      },
    },
  },
  etherscan: {
    apiKey: {
      //@ts-ignore
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};

export default config;

// npx hardhat run scripts/deploy.ts --network sepolia
//  npx hardhat verify --network sepolia <ADDRESS>

// npx hardhat test
