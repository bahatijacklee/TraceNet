import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  hash: string;
  type: "register" | "claim" | "update" | "other";
  status: "success" | "pending" | "failed";
  timestamp: string;
  amount?: string;
  device?: string;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

const TransactionHistory = ({
  transactions = [
    {
      id: "tx-001",
      hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      type: "register",
      status: "success",
      timestamp: "2023-06-15T14:30:00",
      device: "Smart Sensor (DEV-1234)",
    },
    {
      id: "tx-002",
      hash: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
      type: "claim",
      status: "success",
      timestamp: "2023-06-14T10:15:00",
      amount: "0.05 ETH",
    },
    {
      id: "tx-003",
      hash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
      type: "update",
      status: "pending",
      timestamp: "2023-06-13T09:45:00",
      device: "Temperature Sensor (DEV-5678)",
    },
    {
      id: "tx-004",
      hash: "0x7g6f5e4d3c2b1a0j9i8h7g6f5e4d3c2b1a0j9i8h",
      type: "claim",
      status: "failed",
      timestamp: "2023-06-12T16:20:00",
      amount: "0.03 ETH",
    },
    {
      id: "tx-005",
      hash: "0x5e4d3c2b1a0j9i8h7g6f5e4d3c2b1a0j9i8h7g6f",
      type: "register",
      status: "success",
      timestamp: "2023-06-11T11:05:00",
      device: "Humidity Sensor (DEV-9012)",
    },
  ],
  isLoading = false,
}: TransactionHistoryProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Truncate transaction hash for display
  const truncateHash = (hash: string) => {
    if (hash.length <= 14) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Get badge for transaction type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "register":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            Register Device
          </Badge>
        );
      case "claim":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Claim Reward
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            Update Device
          </Badge>
        );
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  // Get status icon and color
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">Success</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-yellow-500">Pending</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-500">Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-500">Unknown</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 h-9 w-[200px] md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>
              A list of your recent blockchain transactions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Transaction Hash
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono text-sm">
                          {truncateHash(transaction.hash)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell>
                      {getStatusIndicator(transaction.status)}
                    </TableCell>
                    <TableCell>
                      {transaction.type === "claim" ? (
                        <span className="font-medium">
                          {transaction.amount}
                        </span>
                      ) : (
                        <span>{transaction.device}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-right">
                  Showing {transactions.length} of {transactions.length}{" "}
                  transactions
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
