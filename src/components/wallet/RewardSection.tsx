import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Coins, ArrowUpRight, History, RefreshCw } from "lucide-react";

interface RewardSectionProps {
  balance?: number;
  tokenSymbol?: string;
  pendingRewards?: number;
  lastClaim?: string;
  transactions?: {
    id: string;
    amount: number;
    timestamp: string;
    status: "completed" | "pending" | "failed";
  }[];
  onClaimRewards?: () => void;
  onViewHistory?: () => void;
}

const RewardSection = ({
  balance = 125.75,
  tokenSymbol = "IOT",
  pendingRewards = 12.5,
  lastClaim = "2023-06-10T09:15:00",
  transactions = [
    {
      id: "tx-1234",
      amount: 25.5,
      timestamp: "2023-06-10T09:15:00",
      status: "completed",
    },
    {
      id: "tx-1235",
      amount: 15.25,
      timestamp: "2023-05-28T14:22:00",
      status: "completed",
    },
  ],
  onClaimRewards = () => console.log("Claim rewards clicked"),
  onViewHistory = () => console.log("View history clicked"),
}: RewardSectionProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-black">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-[400px] h-[250px] overflow-hidden bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Reward Balance</CardTitle>
            <CardDescription>Manage your earned tokens</CardDescription>
          </div>
          <Coins className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {balance} {tokenSymbol}
              </span>
              <span className="text-xs text-muted-foreground">
                Last claim: {formatDate(lastClaim)}
              </span>
            </div>
            <Button onClick={onClaimRewards} className="gap-1">
              <Coins className="h-4 w-4" />
              Claim Rewards
            </Button>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">Pending Rewards</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">
                    {pendingRewards} {tokenSymbol}
                  </span>
                  <RefreshCw className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">
                  Recent Transaction
                </span>
                {transactions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">
                      {transactions[0].amount} {tokenSymbol}
                    </span>
                    {getStatusBadge(transactions[0].status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onViewHistory}
        >
          <History className="h-4 w-4 mr-2" />
          View Transaction History
          <ArrowUpRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardSection;
