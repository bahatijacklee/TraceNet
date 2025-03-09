import { useAccount, useBalance } from "wagmi";
import { useAccessManager } from "./useAccessManager";
import { useState, useEffect } from "react";

export function useWeb3Auth() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    enabled: !!address,
  });
  const { hasRole, getAdminRole } = useAccessManager();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    if (balanceData) {
      // Format the balance to show exactly 2 decimal places
      const formattedBalance = Number(balanceData.formatted).toFixed(2);
      setBalance(formattedBalance);
    }
  }, [balanceData]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        try {
          // Check if address matches the deployer address which has admin role
          const ADMIN_ADDRESS = "0x0E76194944d43BF027d786421fF3aA90ABDDeECe";
          if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
            setIsAdmin(true);
          } else {
            const adminRole = await getAdminRole();
            const hasAdminRole = await hasRole(
              adminRole as `0x${string}`,
              address,
            );
            setIsAdmin(!!hasAdminRole);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [isConnected, address]);

  return {
    address,
    isConnected,
    isAdmin,
    isLoading,
    balance,
  };
}
