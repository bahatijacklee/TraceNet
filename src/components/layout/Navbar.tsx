import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTheme } from "../../lib/ThemeProvider";
import { useWatchContractEvent } from "wagmi";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Home,
  HardDrive,
  Database,
  Gift,
  Shield,
  Bell,
  Sun,
  Moon,
  LogOut,
  Coins,
} from "lucide-react";
import WalletDetailsModal from "../wallet/WalletDetailsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useWeb3Auth } from "../../lib/hooks/useWeb3Auth";
import {
  ACCESS_MANAGER_ADDRESS,
  IOT_DATA_LEDGER_ADDRESS,
  TOKEN_REWARDS_ADDRESS,
  ORACLE_INTEGRATION_ADDRESS,
} from "../../lib/web3config";
import AccessManagerABI from "../../abis/AccessManager.json";
import IoTDataLedgerABI from "../../abis/IoTDataLedger.json";
import TokenRewardsABI from "../../abis/TokenRewards.json";
import OracleIntegrationABI from "../../abis/OracleIntegration.json";
import { formatUnits } from "viem";

export default function Navbar() {
  const { isConnected, address, balance } = useWeb3Auth();
  const { disconnect } = useDisconnect();
  const { theme, setTheme } = useTheme();
  const { openConnectModal } = useConnectModal();
  const { isAdmin } = useWeb3Auth();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);

  // Watch for events across contracts
  useWatchContractEvent({
    address: ACCESS_MANAGER_ADDRESS as `0x${string}`,
    abi: AccessManagerABI.abi,
    eventName: "RoleGranted",
    onLogs: (logs) => {
      const message = `New admin role granted! ${logs[0].args.account}`;
      setNotifications((prev) => [...prev, message]);
      toast.success(message);
    },
  });

  useWatchContractEvent({
    address: IOT_DATA_LEDGER_ADDRESS as `0x${string}`,
    abi: IoTDataLedgerABI.abi,
    eventName: "DataRecorded",
    onLogs: (logs) => {
      const message = `New data recorded for device ${logs[0].args.deviceHash}`;
      setNotifications((prev) => [...prev, message]);
      toast.info(message);
    },
  });

  useWatchContractEvent({
    address: TOKEN_REWARDS_ADDRESS as `0x${string}`,
    abi: TokenRewardsABI.abi,
    eventName: "RewardsClaimed",
    onLogs: (logs) => {
      const amount = formatUnits(logs[0].args.amount, 18);
      const message = `Reward claimed: ${amount} IDC tokens`;
      setNotifications((prev) => [...prev, message]);
      toast.success(message);
    },
  });

  useWatchContractEvent({
    address: ORACLE_INTEGRATION_ADDRESS as `0x${string}`,
    abi: OracleIntegrationABI.abi,
    eventName: "VerificationCompleted",
    onLogs: (logs) => {
      const message = `Oracle verification completed for request: ${logs[0].args.requestId}`;
      setNotifications((prev) => [...prev, message]);
      toast.info(message);
    },
  });

  const truncateAddress = (address: string) => {
    if (!address || address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">TraceNet</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/devices"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HardDrive className="h-4 w-4" />
              <span>Devices</span>
            </Link>
            <Link
              to="/data"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Database className="h-4 w-4" />
              <span>Data</span>
            </Link>
            <Link
              to="/rewards"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Gift className="h-4 w-4" />
              <span>Rewards</span>
            </Link>
            {isConnected && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  Notifications
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="text-sm text-muted-foreground p-2 border-b border-border last:border-0"
                    >
                      {notification}
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setNotifications([])}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Wallet Connection */}
          {isConnected && address ? (
            <>
              <Button
                variant="outline"
                className="flex items-center shadow-lg smooth-transition hover:shadow-xl"
                onClick={() => setShowWalletDetails(true)}
              >
                <Coins className="h-4 w-4 mr-2 text-primary" />
                <div className="flex flex-col items-end">
                  <span>{truncateAddress(address)}</span>
                  <span className="text-xs text-muted-foreground">
                    {balance} ETH
                  </span>
                </div>
              </Button>

              <WalletDetailsModal
                isOpen={showWalletDetails}
                onOpenChange={setShowWalletDetails}
                address={address}
                balance={balance}
              />
            </>
          ) : (
            <Button
              onClick={openConnectModal}
              className="btn-modern shadow-lg smooth-transition hover:shadow-xl"
            >
              <Coins className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
