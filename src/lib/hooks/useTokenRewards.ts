import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { TOKEN_REWARDS_ADDRESS } from "../web3config";
import TokenRewardsABI from "../../abis/TokenRewards.json";

export function useTokenRewards() {
  const { writeContract } = useWriteContract();

  // Get user balance
  const getUserBalance = async (address: `0x${string}`) => {
    try {
      const { data } = useReadContract({
        address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
        abi: TokenRewardsABI.abi,
        functionName: "getUserBalance",
        args: [address],
      });
      return data;
    } catch (error) {
      console.error("Error getting user balance:", error);
      return BigInt(0);
    }
  };

  // Get slashed balance
  const getSlashedBalance = async (address: `0x${string}`) => {
    try {
      const { data } = useReadContract({
        address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
        abi: TokenRewardsABI.abi,
        functionName: "getSlashedBalance",
        args: [address],
      });
      return data;
    } catch (error) {
      console.error("Error getting slashed balance:", error);
      return BigInt(0);
    }
  };

  // Calculate rewards
  const calculateRewards = async (
    deviceHash: `0x${string}`,
    operator: `0x${string}`,
  ) => {
    try {
      const { data } = useReadContract({
        address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
        abi: TokenRewardsABI.abi,
        functionName: "calculateRewards",
        args: [deviceHash, operator],
      });
      return data;
    } catch (error) {
      console.error("Error calculating rewards:", error);
      return BigInt(0);
    }
  };

  // Claim rewards
  const claimRewards = async (deviceHash: `0x${string}`) => {
    try {
      console.log(`Claiming rewards for device hash: ${deviceHash}`);
      const tx = await writeContract({
        address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
        abi: TokenRewardsABI.abi,
        functionName: "claimRewards",
        args: [deviceHash],
      });

      console.log("Claim transaction submitted:", tx);
      toast.success("Reward claim transaction submitted!");
      return tx;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error(
        `Failed to claim rewards: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  };

  // Watch for rewards claimed events
  useWatchContractEvent({
    address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
    abi: TokenRewardsABI.abi,
    eventName: "RewardsClaimed",
    onLogs: (logs) => {
      console.log("Rewards claimed:", logs);
      const amount = logs[0].args.amount
        ? formatUnits(logs[0].args.amount, 18)
        : "0";
      toast.success(`Reward claimed: ${amount} IDC tokens`);
    },
  });

  return {
    getUserBalance,
    getSlashedBalance,
    calculateRewards,
    claimRewards,
  };
}
