import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Particles } from "../components/ui/particles";
import { useWeb3Auth } from "../lib/hooks/useWeb3Auth";
import { useIoTDataLedger } from "../lib/hooks/useIoTDataLedger";
import { useOracleIntegration } from "../lib/hooks/useOracleIntegration";
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
import { Database, Plus, RefreshCw, Upload, AlertCircle } from "lucide-react";
import DataVisualization from "../components/dashboard/DataVisualization";

const Data: React.FC = () => {
  const { isConnected, address } = useWeb3Auth();
  const { recordData } = useIoTDataLedger();
  const { getPendingDisputes } = useOracleIntegration();
  const [deviceId, setDeviceId] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [pendingDisputes, setPendingDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      if (isConnected) {
        setIsLoading(true);
        try {
          const disputes = await getPendingDisputes();
          setPendingDisputes(disputes || []);
        } catch (error) {
          console.error("Error fetching disputes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDisputes();
  }, [isConnected]);

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId || !dataValue) return;

    try {
      // Hash the data value to create a data hash
      // In a real implementation, we would use a proper hashing function
      // For this demo, we'll create a simple hash
      const encoder = new TextEncoder();
      const data = encoder.encode(dataValue);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex =
        "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Define a data type (1 = temperature, 2 = humidity, etc.)
      const dataType = `0x0000000000000000000000000000000000000000000000000000000000000001`;

      console.log("Submitting data to blockchain:", {
        deviceId,
        dataValue,
        dataHash: hashHex,
        dataType,
      });

      // Call the smart contract to record the data
      await recordData(
        deviceId as `0x${string}`,
        dataType as `0x${string}`,
        hashHex as `0x${string}`,
      );

      // Show success toast
      toast.success("Data submitted successfully to blockchain");

      // Clear form
      setDeviceId("");
      setDataValue("");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data to blockchain");
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
              Please connect your wallet to access the Data page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Particles
        quantity={35}
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
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold">IoT Data Management</h1>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardHeader className="relative z-10">
              <CardTitle>Record New Data</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.form
                onSubmit={handleSubmitData}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="deviceId">Device Hash</Label>
                  <Input
                    id="deviceId"
                    placeholder="0x..."
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataValue">Data Value</Label>
                  <Input
                    id="dataValue"
                    placeholder="Enter sensor reading"
                    value={dataValue}
                    onChange={(e) => setDataValue(e.target.value)}
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <Upload className="h-4 w-4" />
                    </motion.div>
                    <span className="relative z-10">Submit Data</span>
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DataVisualization />
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-4"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Pending Data Disputes
        </motion.h2>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardContent className="p-6 relative z-10">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingDisputes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <AlertCircle className="h-8 w-8 mb-2 text-green-500" />
                  <p className="text-green-500">No pending disputes found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingDisputes.map((dispute, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <p className="font-medium">
                          Device: {dispute.deviceHash.substring(0, 10)}...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Record: {dispute.recordIndex.toString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Disputer: {dispute.disputer.substring(0, 10)}...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Timestamp:{" "}
                          {new Date(
                            Number(dispute.timestamp) * 1000,
                          ).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Data;
