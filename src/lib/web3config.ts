import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "viem";

export const DEVICE_REGISTRY_ADDRESS =
  "0xE851a734e8f310951e6d27C3B087FE939E371Fbd"; // DeviceRegistry contract address
export const ACCESS_MANAGER_ADDRESS =
  "0x18C792C368279C490042E85fb4DCC2FB650CE44e"; // AccessManager contract address
export const IOT_DATA_LEDGER_ADDRESS =
  "0xf6A7E3d41611FcAf815C6943807B690Ee9Bf8220"; // IoTDataLedger contract address
export const TOKEN_REWARDS_ADDRESS =
  "0xca276186Eb9f3a58FCdfc4adA247Cbe8d935778a"; // TokenRewards contract address
export const ORACLE_INTEGRATION_ADDRESS =
  "0x48C20882E61Ca563E064376480D886870d1d695e"; // OracleIntegration contract address
export const ADMIN_ADDRESS = "0x0E76194944d43BF027d786421fF3aA90ABDDeECe"; // Deployer address with admin role

export const config = getDefaultConfig({
  appName: "IoT Device Management DApp",
  projectId: "0807f900bb39818b70b27f58aa804c30", // WalletConnect Project ID
  chains: [sepolia],
  transports: {
    // Try Alchemy first, then fall back to Infura if needed
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/Y4w4eX4Q_LS3plzHFKmZ-67wn3Y0fnPg",
      {
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
        fallbackTransports: [
          http("https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
          http("https://rpc.sepolia.org"),
        ],
      },
    ),
  },
});

// Use your Web3.Storage token
export const WEB3_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6a2V5Ono2TWtxUkg1NXBSRHRUUFZ0RUx3R1VkYzJLNDJ5Z0xpUHQxSnVZYzRIeVRQQWo0YiIsImlzcyI6IndlYjMtc3RvcmFnZSIsImlhdCI6MTY5ODc2NTQzMjU2OSwibmFtZSI6IklvVERBcHAifQ.Nt_oRTYuUzHgmklSPVF9L5_LFpwQYHXGI-ETLIBnzSM";
