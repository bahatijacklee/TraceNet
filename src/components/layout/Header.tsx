import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sun,
  Moon,
  Menu,
  X,
  Wallet,
  Home,
  BarChart2,
  PlusCircle,
  History,
  LogOut,
  Database,
  Coins,
  Shield,
} from "lucide-react";
import { useWeb3Auth } from "../../lib/hooks/useWeb3Auth";

interface HeaderProps {
  isDarkMode?: boolean;
  onThemeToggle?: (isDark: boolean) => void;
}

const Header = ({
  isDarkMode = false,
  onThemeToggle = () => {},
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { isAdmin } = useWeb3Auth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleThemeToggle = () => {
    onThemeToggle(!isDarkMode);
  };

  const truncateAddress = (address: string) => {
    if (!address || address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { label: "Home", icon: <Home className="h-4 w-4 mr-2" />, path: "/" },
    {
      label: "Devices",
      icon: <Database className="h-4 w-4 mr-2" />,
      path: "/devices",
    },
    {
      label: "Data",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      path: "/data",
    },
    {
      label: "Rewards",
      icon: <Coins className="h-4 w-4 mr-2" />,
      path: "/rewards",
    },
  ];

  // Add Admin link if user is admin
  if (isAdmin) {
    navItems.push({
      label: "Admin",
      icon: <Shield className="h-4 w-4 mr-2" />,
      path: "/admin",
    });
  }

  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-lg">
      <div className="flex items-center">
        <div className="flex items-center mr-6">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mr-2 shadow-lg">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">IoT DApp</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex items-center smooth-transition hover:bg-primary/10"
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <div className="flex items-center mr-2">
          <Sun className="h-4 w-4 mr-2 text-yellow-500" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={handleThemeToggle}
            className="smooth-transition"
          />
          <Moon className="h-4 w-4 ml-2 text-blue-500" />
        </div>

        {/* Wallet Connection */}
        {isConnected && address ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center shadow-lg smooth-transition hover:shadow-xl"
              >
                <Wallet className="h-4 w-4 mr-2 text-primary" />
                {truncateAddress(address)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="animate-fadeIn shadow-lg"
            >
              <DropdownMenuItem
                className="cursor-pointer smooth-transition"
                onClick={() => {
                  if (disconnectWallet) {
                    // Clear any local storage items related to wallet connection
                    localStorage.removeItem("wagmi.connected");
                    localStorage.removeItem("wagmi.wallet");
                    localStorage.removeItem("wagmi.store");
                    localStorage.removeItem("rk-wallets");

                    disconnectWallet();
                    toast.success("Wallet disconnected successfully");

                    // Use a short timeout before reload to ensure disconnect completes
                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2 text-red-500" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={openConnectModal}
            className="btn-modern shadow-lg smooth-transition hover:shadow-xl"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden smooth-transition"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-background border-b border-border z-50 p-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex items-center justify-start w-full smooth-transition hover:bg-primary/10"
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
