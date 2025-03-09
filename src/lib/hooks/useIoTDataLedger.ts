import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { IOT_DATA_LEDGER_ADDRESS } from "../web3config";
import IoTDataLedgerABI from "../../abis/IoTDataLedger.json";

export function useIoTDataLedger() {
  const { writeContract } = useWriteContract();

  // Record data for a device
  const recordData = async (
    deviceHash: `0x${string}`,
    dataType: `0x${string}`,
    dataHash: `0x${string}`,
  ) => {
    try {
      console.log(`Recording data for device ${deviceHash}`);
      console.log(`Data type: ${dataType}`);
      console.log(`Data hash: ${dataHash}`);

      return await writeContract({
        address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
        abi: IoTDataLedgerABI.abi,
        functionName: "recordData",
        args: [deviceHash, dataType, dataHash],
      });
    } catch (error) {
      console.error("Error recording data:", error);
      throw error;
    }
  };

  // Batch record data for multiple devices
  const batchRecordData = async (
    deviceHashes: `0x${string}`[],
    dataTypes: `0x${string}`[],
    dataHashes: `0x${string}`[],
  ) => {
    try {
      return await writeContract({
        address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
        abi: IoTDataLedgerABI.abi,
        functionName: "batchRecordData",
        args: [deviceHashes, dataTypes, dataHashes],
      });
    } catch (error) {
      console.error("Error batch recording data:", error);
      throw error;
    }
  };

  // Get records for a device
  const getRecords = async (
    deviceHash: `0x${string}`,
    start: number,
    count: number,
  ) => {
    try {
      const { data } = useReadContract({
        address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
        abi: IoTDataLedgerABI.abi,
        functionName: "getRecords",
        args: [deviceHash, BigInt(start), BigInt(count)],
      });
      return data;
    } catch (error) {
      console.error("Error getting records:", error);
      return [];
    }
  };

  // Validate data
  const validateData = async (deviceHash: `0x${string}`, timestamp: number) => {
    try {
      return await writeContract({
        address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
        abi: IoTDataLedgerABI.abi,
        functionName: "validateData",
        args: [deviceHash, BigInt(timestamp)],
      });
    } catch (error) {
      console.error("Error validating data:", error);
      throw error;
    }
  };

  // Watch for data recorded events
  useWatchContractEvent({
    address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
    abi: IoTDataLedgerABI.abi,
    eventName: "DataRecorded",
    onLogs: (logs) => {
      console.log("New data recorded:", logs);
      toast.info(`New data recorded for device ${logs[0].args.deviceHash}`);
    },
  });

  return {
    recordData,
    batchRecordData,
    getRecords,
    validateData,
  };
}
