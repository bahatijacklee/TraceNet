import React, { useState } from "react";
import Header from "./layout/Header";
import DeviceGrid from "./dashboard/DeviceGrid";
import DataVisualization from "./dashboard/DataVisualization";
import RewardSection from "./wallet/RewardSection";
import DeviceRegistrationForm from "./forms/DeviceRegistrationForm";
import TransactionHistory from "./wallet/TransactionHistory";
import WalletConnectionModal from "./wallet/WalletConnectionModal";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

const Home = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Handle wallet connection
  const handleConnectWallet = async (walletType: string) => {
    // Simulate wallet connection
    console.log(`Connecting to ${walletType}...`);

    // Mock successful connection after a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    setIsWalletConnected(true);
    setShowWalletModal(false);
    return true;
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = () => {
    setWalletAddress("");
    setIsWalletConnected(false);
  };

  // Handle theme toggle
  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    // In a real app, you would apply the theme to the document here
  };

  // Handle device registration
  const handleAddDevice = () => {
    setShowRegistrationForm(true);
  };

  // Handle device registration form submission
  const handleDeviceRegistration = (data: any) => {
    console.log("Device registration data:", data);
    setShowRegistrationForm(false);
    // In a real app, you would submit this data to a smart contract
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      {/* Header */}
      <Header
        isConnected={isWalletConnected}
        walletAddress={walletAddress}
        onConnect={() => setShowWalletModal(true)}
        onDisconnect={handleDisconnectWallet}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Welcome Section (only shown when wallet is not connected) */}
          {!isWalletConnected && (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">
                Welcome to IoT Device Management DApp
              </h1>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Connect your wallet to manage your IoT devices, view analytics,
                and earn rewards through our blockchain-powered platform.
              </p>
              <Button
                size="lg"
                onClick={() => setShowWalletModal(true)}
                className="font-semibold"
              >
                Connect Wallet to Get Started
              </Button>
            </div>
          )}

          {/* Dashboard Content (only shown when wallet is connected) */}
          {isWalletConnected && (
            <>
              {/* Top Row - Device Grid and Reward Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DeviceGrid onAddDevice={handleAddDevice} />
                </div>
                <div className="lg:col-span-1">
                  <RewardSection />
                </div>
              </div>

              {/* Middle Row - Data Visualization */}
              <div className="w-full flex justify-center">
                <DataVisualization />
              </div>

              {/* Bottom Row - Transaction History */}
              <div className="w-full">
                <TransactionHistory />
              </div>

              {/* Floating Action Button for Mobile */}
              <div className="fixed bottom-6 right-6 md:hidden">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg"
                  onClick={handleAddDevice}
                >
                  <PlusCircle className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onOpenChange={setShowWalletModal}
        onConnect={handleConnectWallet}
      />

      {/* Device Registration Form Modal */}
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

export default Home;
