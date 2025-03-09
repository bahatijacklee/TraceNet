import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { toast } from "sonner";
import { ORACLE_INTEGRATION_ADDRESS } from "../web3config";
import OracleIntegrationABI from "../../abis/OracleIntegration.json";

export function useOracleIntegration() {
  const { writeContract } = useWriteContract();

  // Request data verification
  const requestDataVerification = async (
    deviceHash: `0x${string}`,
    recordIndex: number,
    externalAPI: string,
  ) => {
    try {
      return await writeContract({
        address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
        abi: OracleIntegrationABI.abi,
        functionName: "requestDataVerification",
        args: [deviceHash, BigInt(recordIndex), externalAPI],
      });
    } catch (error) {
      console.error("Error requesting data verification:", error);
      throw error;
    }
  };

  // Resolve a dispute
  const resolveDispute = async (
    deviceHash: `0x${string}`,
    recordIndex: number,
    finalValidity: boolean,
  ) => {
    try {
      return await writeContract({
        address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
        abi: OracleIntegrationABI.abi,
        functionName: "resolveDispute",
        args: [deviceHash, BigInt(recordIndex), finalValidity],
      });
    } catch (error) {
      console.error("Error resolving dispute:", error);
      throw error;
    }
  };

  // Get pending disputes
  const getPendingDisputes = async () => {
    try {
      const { data } = useReadContract({
        address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
        abi: OracleIntegrationABI.abi,
        functionName: "getPendingDisputes",
      });
      return data;
    } catch (error) {
      console.error("Error getting pending disputes:", error);
      return [];
    }
  };

  // Update oracle configuration
  const updateOracleConfig = async (
    newOracle: `0x${string}`,
    newJobId: `0x${string}`,
    newFee: bigint,
  ) => {
    try {
      return await writeContract({
        address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
        abi: OracleIntegrationABI.abi,
        functionName: "updateOracleConfig",
        args: [newOracle, newJobId, newFee],
      });
    } catch (error) {
      console.error("Error updating oracle config:", error);
      throw error;
    }
  };

  // Watch for verification completed events
  useWatchContractEvent({
    address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
    abi: OracleIntegrationABI.abi,
    eventName: "VerificationCompleted",
    onLogs: (logs) => {
      console.log("Verification completed:", logs);
      toast.info(
        `Oracle verification completed for request: ${logs[0].args?.requestId || "Unknown request"}`,
      );
    },
  });

  return {
    requestDataVerification,
    resolveDispute,
    getPendingDisputes,
    updateOracleConfig,
  };
}
