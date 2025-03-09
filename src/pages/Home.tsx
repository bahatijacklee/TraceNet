import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Particles } from "../components/ui/particles";
import { useWeb3Auth } from "../lib/hooks/useWeb3Auth";
import { useDeviceRegistry } from "../lib/hooks/useDeviceRegistry";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Wallet, Database, Users } from "lucide-react";
import WalletConnectionModal from "../components/wallet/WalletConnectionModal";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { isConnected, address, isAdmin } = useWeb3Auth();
  const { getDevicesByOwner } = useDeviceRegistry();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [stats, setStats] = useState({
    totalDevices: 0,
    dataPoints: 0,
    role: "User",
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (isConnected && address) {
        try {
          // Fetch user devices
          const devices = await getDevicesByOwner(address as `0x${string}`);
          setStats({
            totalDevices: devices?.length || 0,
            dataPoints: Math.floor(Math.random() * 1000), // Mock data points
            role: isAdmin ? "Admin" : "User",
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };

    fetchStats();
  }, [isConnected, address, isAdmin]);

  return (
    <div className="min-h-screen bg-background relative">
      <Particles
        quantity={50}
        color="var(--primary)"
        className="opacity-20"
        particleSize={3}
      />
      {/* Hero Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted relative">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-8 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              IoT Device Management DApp
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Securely manage your IoT devices on the blockchain with real-time
              data tracking and rewards.
            </motion.p>
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="mt-6 btn-modern shadow-lg relative overflow-hidden"
                  onClick={() => setShowWalletModal(true)}
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
                    <Wallet className="h-4 w-4" />
                  </motion.div>
                  <span className="relative z-10">
                    Connect Wallet to Get Started
                  </span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container px-4 py-12 md:px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-lg overflow-hidden">
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
                <CardTitle className="text-2xl">Total Devices</CardTitle>
                <CardDescription>Your registered IoT devices</CardDescription>
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
                    <Database className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold"
                  >
                    {isConnected ? stats.totalDevices : "—"}
                  </motion.span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-lg overflow-hidden">
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
                <CardTitle className="text-2xl">Data Points</CardTitle>
                <CardDescription>Total data records collected</CardDescription>
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
                    <Database className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold"
                  >
                    {isConnected ? stats.dataPoints : "—"}
                  </motion.span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-lg overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
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
                <CardTitle className="text-2xl">Your Role</CardTitle>
                <CardDescription>Current access level</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center">
                  <motion.div
                    animate={{
                      y: [0, -5, 0, 5, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mr-4"
                  >
                    <Users className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold"
                  >
                    {isConnected ? stats.role : "—"}
                  </motion.span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Getting Started Section */}
        {isConnected && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <motion.h2
              className="text-2xl font-bold mb-6"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Getting Started
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="shadow-lg overflow-hidden">
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
                    <CardTitle>Register Devices</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground mb-4 text-balance">
                      Add your IoT devices to the blockchain registry with
                      secure metadata storage on IPFS.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full relative overflow-hidden"
                        asChild
                      >
                        <Link to="/devices">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">Go to Devices</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="shadow-lg overflow-hidden">
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
                    <CardTitle>Record Data</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground mb-4 text-balance">
                      Submit IoT sensor data to the blockchain and visualize
                      trends over time.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full relative overflow-hidden"
                        asChild
                      >
                        <Link to="/data">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">Go to Data</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="shadow-lg overflow-hidden">
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
                    <CardTitle>Claim Rewards</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground mb-4 text-balance">
                      Earn tokens for contributing valid data and maintaining
                      your devices.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full relative overflow-hidden"
                        asChild
                      >
                        <Link to="/rewards">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">Go to Rewards</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onOpenChange={setShowWalletModal}
      />
    </div>
  );
};

export default Home;
