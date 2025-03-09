import { useReadContract, useWriteContract } from "wagmi";
import { ACCESS_MANAGER_ADDRESS } from "../web3config";
import AccessManagerABI from "../../abis/AccessManager.json";

export function useAccessManager() {
  const { writeContract } = useWriteContract();

  // Check if an address has a specific role
  const hasRole = async (role: `0x${string}`, account: `0x${string}`) => {
    try {
      const { data } = useReadContract({
        address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
        abi: AccessManagerABI.abi,
        functionName: "hasRole",
        args: [role, account],
      });
      return data;
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  };

  // Grant a role to an address
  const grantRole = async (role: `0x${string}`, account: `0x${string}`) => {
    try {
      return await writeContract({
        address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
        abi: AccessManagerABI.abi,
        functionName: "grantRole",
        args: [role, account],
      });
    } catch (error) {
      console.error("Error granting role:", error);
      throw error;
    }
  };

  // Revoke a role from an address
  const revokeRole = async (role: `0x${string}`, account: `0x${string}`) => {
    try {
      return await writeContract({
        address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
        abi: AccessManagerABI.abi,
        functionName: "revokeRole",
        args: [role, account],
      });
    } catch (error) {
      console.error("Error revoking role:", error);
      throw error;
    }
  };

  // Get admin role
  const getAdminRole = async () => {
    try {
      const { data } = useReadContract({
        address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
        abi: AccessManagerABI.abi,
        functionName: "GLOBAL_ADMIN_ROLE",
      });
      return data;
    } catch (error) {
      console.error("Error getting admin role:", error);
      return "0x0000000000000000000000000000000000000000000000000000000000000000";
    }
  };

  // Get device manager role
  const getDeviceManagerRole = async () => {
    try {
      const { data } = useReadContract({
        address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
        abi: AccessManagerABI.abi,
        functionName: "DEVICE_MANAGER_ROLE",
      });
      return data;
    } catch (error) {
      console.error("Error getting device manager role:", error);
      return "0x0000000000000000000000000000000000000000000000000000000000000000";
    }
  };

  return {
    hasRole,
    grantRole,
    revokeRole,
    getAdminRole,
    getDeviceManagerRole,
  };
}
