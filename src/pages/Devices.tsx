import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Particles } from "../components/ui/particles";
import { useWeb3Auth } from "../lib/hooks/useWeb3Auth";
import { useDeviceRegistry } from "../lib/hooks/useDeviceRegistry";
import { useDeviceStorage } from "../lib/hooks/useDeviceStorage";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Database, Plus, RefreshCw, Upload } from "lucide-react";
import DeviceGrid from "../components/dashboard/DeviceGrid";
import DeviceRegistrationForm from "../components/forms/DeviceRegistrationForm";

const Devices: React.FC = () => {
  const { isConnected, address } = useWeb3Auth();
  const { devices, isLoading, getDevicesByOwner, registerDevice } =
    useDeviceRegistry();
  const { storeDeviceMetadata, isUploading, ipfsCid } = useDeviceStorage();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      if (isConnected && address) {
        await getDevicesByOwner(address as `0x${string}`);
      }
    };

    fetchDevices();
  }, [isConnected, address]);

  const handleAddDevice = () => {
    setShowRegistrationForm(true);
  };

  const handleDeviceRegistration = async (data: any) => {
    try {
      // Upload metadata to IPFS
      const metadata = {
        name: data.name,
        type: data.deviceType,
        location: data.location,
        description: data.description || "",
        macAddress: data.macAddress,
        firmware: data.firmware,
        timestamp: Date.now(),
      };

      const cid = await storeDeviceMetadata(metadata, []);
      console.log("Device metadata stored with CID:", cid);

      // Generate a device hash from the MAC address (in a real app, this would be more secure)
      // Ensure the hash is exactly 32 bytes (64 hex characters) without 0x prefix
      const macBytes = Array.from(data.macAddress)
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");

      // Pad or truncate to exactly 64 characters
      const paddedMacBytes = macBytes.padEnd(64, "0").substring(0, 64);
      const deviceHash = `0x${paddedMacBytes}`;

      console.log("Generated device hash:", deviceHash);
      console.log("Hash length (without 0x):", deviceHash.slice(2).length);

      // Mock signature for testing - ensure it's a valid length for ECDSA signature (65 bytes)
      const mockSignature = `0x${"1".padEnd(130, "0")}`;
      console.log("Using signature:", mockSignature);
      console.log(
        "Signature length (without 0x):",
        mockSignature.slice(2).length,
      );

      // Register the device on the blockchain
      try {
        // Try to register the device on the blockchain
        console.log("Registering device on blockchain");
        const tx = await registerDevice(
          deviceHash as `0x${string}`,
          cid,
          mockSignature as `0x${string}`,
        );

        console.log("Transaction result:", tx);
        toast.success(
          `Device ${data.name} registered successfully on blockchain`,
        );
      } catch (err) {
        console.error("Error registering on blockchain:", err);
        if (err instanceof Error) {
          console.error("Error details:", err.message);
          toast.warning(
            `Device metadata stored, but blockchain registration failed: ${err.message}`,
          );
        } else {
          toast.warning(
            "Device metadata stored, but blockchain registration failed",
          );
        }
      }

      setShowRegistrationForm(false);

      // Refresh the device list
      if (address) {
        await getDevicesByOwner(address as `0x${string}`);
      }
    } catch (error) {
      console.error("Error registering device:", error);
      toast.error("Failed to register device");
    }
  };

  const handleRefresh = async () => {
    if (address) {
      await getDevicesByOwner(address as `0x${string}`);
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
              Please connect your wallet to access the Devices page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Particles
        quantity={40}
        color="var(--primary)"
        className="opacity-20"
        particleSize={2}
      />
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Device Management</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddDevice}
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Plus className="h-4 w-4" />
            </motion.div>
            <span className="relative z-10">Register New Device</span>
          </Button>
        </motion.div>
      </motion.div>

      <DeviceGrid
        devices={devices}
        isLoading={isLoading}
        onAddDevice={handleAddDevice}
        onRefresh={handleRefresh}
      />

      {/* Device Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <DeviceRegistrationForm onSubmit={handleDeviceRegistration} />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRegistrationForm(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
