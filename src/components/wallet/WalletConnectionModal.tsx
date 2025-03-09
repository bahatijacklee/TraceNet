import React from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Wallet, LogOut } from "lucide-react";

interface WalletConnectionModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WalletConnectionModal = ({
  isOpen = false,
  onOpenChange = () => {},
}: WalletConnectionModalProps) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal();
      onOpenChange(false);
    } else {
      // Fallback to direct connector usage if RainbowKit modal isn't available
      const connector = connectors[0]; // Usually the first connector is injected (MetaMask)
      if (connector) {
        connect({ connector });
        onOpenChange(false);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      // Clear any local storage items related to wallet connection
      localStorage.removeItem("wagmi.connected");
      localStorage.removeItem("wagmi.wallet");
      localStorage.removeItem("wagmi.store");
      localStorage.removeItem("rk-wallets");

      onOpenChange(false);

      // Use a short timeout before reload to ensure disconnect completes
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Force reload anyway as a fallback
      window.location.reload();
    }
  };

  const truncateAddress = (address: string) => {
    if (!address || address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-background shadow-lg animate-fadeIn">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
          </DialogTitle>
          <DialogDescription className="text-balance">
            {isConnected
              ? `Your wallet is connected to the IoT Device Management DApp`
              : `Connect your wallet to interact with the IoT Device Management DApp`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-mono font-medium text-lg">
                  {truncateAddress(address || "")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connected Address
                </p>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full shadow-lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">
                Click the button below to connect using RainbowKit
              </p>
              <Button
                onClick={handleConnect}
                className="w-full btn-modern shadow-lg"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            <p className="text-balance">
              By connecting your wallet, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectionModal;
