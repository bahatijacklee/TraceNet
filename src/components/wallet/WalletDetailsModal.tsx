import React from "react";
import { useDisconnect } from "wagmi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Copy, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface WalletDetailsModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  address: string;
  balance: string;
}

const WalletDetailsModal = ({
  isOpen = false,
  onOpenChange = () => {},
  address,
  balance,
}: WalletDetailsModalProps) => {
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      // Clear any local storage items related to wallet connection
      localStorage.removeItem("wagmi.connected");
      localStorage.removeItem("wagmi.wallet");
      localStorage.removeItem("wagmi.store");
      localStorage.removeItem("rk-wallets");

      disconnect();
      toast.success("Wallet disconnected successfully");
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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-background shadow-lg animate-fadeIn">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Wallet Connected
          </DialogTitle>
          <DialogDescription className="text-balance">
            Your wallet is connected to the IoT Device Management DApp
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <p className="font-mono font-medium text-lg break-all">
                {address}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-2">Balance</p>
              <div className="flex items-center">
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
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">Ξ</span>
                  </div>
                </motion.div>
                <span className="text-2xl font-bold">{balance} ETH</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button
              onClick={handleDisconnect}
              variant="destructive"
              className="w-full shadow-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect Wallet
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WalletDetailsModal;
