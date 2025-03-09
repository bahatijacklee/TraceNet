import React, { useState, useEffect } from "react";
import { useWeb3Auth } from "../lib/hooks/useWeb3Auth";
import { useTokenRewards } from "../lib/hooks/useTokenRewards";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Coins, History, ArrowUpRight } from "lucide-react";
import RewardSection from "../components/wallet/RewardSection";
import TransactionHistory from "../components/wallet/TransactionHistory";
import { motion } from "framer-motion";
import { Particles } from "../components/ui/particles";

const Rewards: React.FC = () => {
  const { isConnected, address } = useWeb3Auth();
  const { getUserBalance, getSlashedBalance, claimRewards } = useTokenRewards();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [slashedBalance, setSlashedBalance] = useState<bigint>(BigInt(0));
  const [claimHistory, setClaimHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        try {
          const userBalance = await getUserBalance(address as `0x${string}`);
          const slashed = await getSlashedBalance(address as `0x${string}`);
          setBalance(userBalance || BigInt(0));
          setSlashedBalance(slashed || BigInt(0));
        } catch (error) {
          console.error("Error fetching balances:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBalances();
  }, [isConnected, address]);

  const handleClaimRewards = async (deviceHash: string) => {
    if (!isConnected || !address) return;

    try {
      setIsLoading(true);

      console.log(
        `Claiming rewards for device ${deviceHash} by address ${address}`,
      );

      // Call the smart contract to claim rewards
      const tx = await claimRewards(deviceHash as `0x${string}`);
      console.log("Claim transaction:", tx);

      // Create a transaction record
      const txHash =
        typeof tx === "object" && tx.hash
          ? tx.hash
          : `tx-${Math.random().toString(36).substring(2, 10)}`;

      // In a production environment, we would listen for events from the contract
      // For now, we'll simulate a successful claim
      const claimAmount = Number(balance) / 10; // Claim 10% of balance as an example
      const newClaim = {
        id: txHash.toString(),
        amount: claimAmount,
        timestamp: new Date().toISOString(),
        status: "completed" as const,
      };

      setClaimHistory([newClaim, ...claimHistory]);
      toast.success(
        `Successfully claimed ${(claimAmount / 1e18).toFixed(2)} IDC tokens`,
      );

      // Refresh balances after claiming
      const userBalance = await getUserBalance(address as `0x${string}`);
      const slashed = await getSlashedBalance(address as `0x${string}`);
      setBalance(userBalance || BigInt(0));
      setSlashedBalance(slashed || BigInt(0));

      console.log("Updated balance:", userBalance);
      console.log("Updated slashed balance:", slashed);
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error(
        "Failed to claim rewards: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Wallet Not Connected</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Please connect your wallet to access the Rewards page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Add particles background */}
      <Particles
        quantity={40}
        color="var(--primary)"
        className="opacity-30"
        particleSize={3}
      />

      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mr-2"
        >
          <Coins className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold">IoT Rewards</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg">Available Rewards</CardTitle>
              <CardDescription>Tokens you can claim</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-4"
                >
                  <Coins className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold"
                >
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    `${(Number(balance) / 1e18).toFixed(2)} IDC`
                  )}
                </motion.span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg">Total Earned</CardTitle>
              <CardDescription>Lifetime rewards</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotateY: [0, 180, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mr-4"
                >
                  <History className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold"
                >
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    `${((Number(balance) + Number(slashedBalance)) / 1e18).toFixed(2)} IDC`
                  )}
                </motion.span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg">Slashed Rewards</CardTitle>
              <CardDescription>Penalties for invalid data</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    y: [0, -5, 0, 5, 0],
                    rotate: [0, 15, 0, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mr-4"
                >
                  <ArrowUpRight className="h-8 w-8 text-destructive" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold text-destructive"
                >
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    `${(Number(slashedBalance) / 1e18).toFixed(2)} IDC`
                  )}
                </motion.span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <RewardSection
            balance={Number(balance) / 1e18}
            tokenSymbol="IDC"
            pendingRewards={12.5} // Mock data
            lastClaim={new Date().toISOString()}
            transactions={claimHistory}
            onClaimRewards={() =>
              handleClaimRewards("0xE851a734e8f310951e6d27C3B087FE939E371Fbd")
            } // Use actual device registry address as device hash
          />
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <TransactionHistory
            transactions={[
              ...claimHistory,
              {
                id: "tx-initial",
                hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                type: "claim",
                status: "success",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                amount: "25.5 IDC",
              },
            ]}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
