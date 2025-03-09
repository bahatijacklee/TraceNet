import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Particles } from "../components/ui/particles";
import { useWeb3Auth } from "../lib/hooks/useWeb3Auth";
import { useAccessManager } from "../lib/hooks/useAccessManager";
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
import { Shield, Settings, Users, Database, Check, X } from "lucide-react";

const Admin: React.FC = () => {
  const { isConnected, isAdmin, isLoading: authLoading } = useWeb3Auth();
  const { grantRole, revokeRole, getAdminRole } = useAccessManager();
  const { getPendingDisputes, resolveDispute, updateOracleConfig } =
    useOracleIntegration();

  const [adminAddress, setAdminAddress] = useState("");
  const [oracleAddress, setOracleAddress] = useState("");
  const [jobId, setJobId] = useState("");
  const [fee, setFee] = useState("");
  const [pendingDisputes, setPendingDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      if (isConnected && isAdmin) {
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
  }, [isConnected, isAdmin]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAddress) return;

    try {
      const adminRole = await getAdminRole();
      await grantRole(
        adminRole as `0x${string}`,
        adminAddress as `0x${string}`,
      );
      toast.success(`Admin role granted to ${adminAddress}`);
      setAdminAddress("");
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to grant admin role");
    }
  };

  const handleRemoveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAddress) return;

    try {
      const adminRole = await getAdminRole();
      await revokeRole(
        adminRole as `0x${string}`,
        adminAddress as `0x${string}`,
      );
      toast.success(`Admin role revoked from ${adminAddress}`);
      setAdminAddress("");
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to revoke admin role");
    }
  };

  const handleUpdateOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oracleAddress || !jobId || !fee) return;

    try {
      console.log("Updating oracle configuration:");
      console.log("Oracle address:", oracleAddress);
      console.log("Job ID:", jobId);
      console.log("Fee:", fee);

      // Convert fee to BigInt with proper validation
      let feeBigInt: bigint;
      try {
        // Convert to wei (assuming fee is in LINK)
        const feeInWei = parseFloat(fee) * 10 ** 18;
        feeBigInt = BigInt(Math.floor(feeInWei));
      } catch (err) {
        toast.error("Invalid fee format");
        return;
      }

      // Ensure jobId is in bytes32 format
      let formattedJobId = jobId;
      if (!jobId.startsWith("0x")) {
        formattedJobId =
          "0x" + Buffer.from(jobId).toString("hex").padEnd(64, "0");
      }

      // Call the contract to update oracle configuration
      const tx = await updateOracleConfig(
        oracleAddress as `0x${string}`,
        formattedJobId as `0x${string}`,
        feeBigInt,
      );

      console.log("Oracle update transaction:", tx);
      toast.success("Oracle configuration updated successfully");

      // Clear form fields
      setOracleAddress("");
      setJobId("");
      setFee("");
    } catch (error) {
      console.error("Error updating oracle:", error);
      toast.error(
        "Failed to update oracle configuration: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  };

  const handleResolveDispute = async (
    deviceHash: string,
    recordIndex: number,
    isValid: boolean,
  ) => {
    try {
      await resolveDispute(deviceHash as `0x${string}`, recordIndex, isValid);
      toast.success(`Dispute resolved as ${isValid ? "valid" : "invalid"}`);

      // Refresh disputes
      const disputes = await getPendingDisputes();
      setPendingDisputes(disputes || []);
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error("Failed to resolve dispute");
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Wallet Not Connected</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Please connect your wallet to access the Admin page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              You do not have admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Particles
        quantity={45}
        color="var(--primary)"
        className="opacity-20"
        particleSize={2}
      />
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mr-2"
        >
          <Shield className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="admins" className="w-full">
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="admins">Admin Management</TabsTrigger>
              <TabsTrigger value="oracle">Oracle Configuration</TabsTrigger>
              <TabsTrigger value="disputes">Dispute Resolution</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="admins">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addAdminAddress">Wallet Address</Label>
                      <Input
                        id="addAdminAddress"
                        placeholder="0x..."
                        value={adminAddress}
                        onChange={(e) => setAdminAddress(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Grant Admin Role
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Remove Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRemoveAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="removeAdminAddress">Wallet Address</Label>
                      <Input
                        id="removeAdminAddress"
                        placeholder="0x..."
                        value={adminAddress}
                        onChange={(e) => setAdminAddress(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="w-full"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Revoke Admin Role
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="oracle">
            <Card>
              <CardHeader>
                <CardTitle>Update Oracle Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateOracle} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oracleAddress">Oracle Address</Label>
                    <Input
                      id="oracleAddress"
                      placeholder="0x..."
                      value={oracleAddress}
                      onChange={(e) => setOracleAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobId">Job ID</Label>
                    <Input
                      id="jobId"
                      placeholder="0x..."
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">Fee (in LINK)</Label>
                    <Input
                      id="fee"
                      type="number"
                      placeholder="0.1"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Oracle Configuration
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>Pending Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : pendingDisputes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <p className="text-muted-foreground">
                      No pending disputes found
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
                      <div>Device Hash</div>
                      <div>Record Index</div>
                      <div>Disputer</div>
                      <div>Timestamp</div>
                      <div>Actions</div>
                    </div>
                    {pendingDisputes.map((dispute, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                      >
                        <div className="font-mono text-sm">
                          {dispute.deviceHash.substring(0, 10)}...
                        </div>
                        <div>{dispute.recordIndex.toString()}</div>
                        <div className="font-mono text-sm">
                          {dispute.disputer.substring(0, 10)}...
                        </div>
                        <div className="text-sm">
                          {new Date(
                            Number(dispute.timestamp) * 1000,
                          ).toLocaleString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-500/10 hover:bg-green-500/20 text-green-500"
                            onClick={() =>
                              handleResolveDispute(
                                dispute.deviceHash,
                                dispute.recordIndex,
                                true,
                              )
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Valid
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
                            onClick={() =>
                              handleResolveDispute(
                                dispute.deviceHash,
                                dispute.recordIndex,
                                false,
                              )
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Invalid
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
