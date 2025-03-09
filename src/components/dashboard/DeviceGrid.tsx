import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Search, Filter, RefreshCw, Settings } from "lucide-react";
import DeviceCard from "./DeviceCard";

interface DeviceData {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  lastActivity: string;
  type: string;
  data: {
    temperature: number;
    humidity: number;
    battery: number;
  };
}

interface DeviceGridProps {
  devices?: DeviceData[];
  isLoading?: boolean;
  onAddDevice?: () => void;
  onRefresh?: () => void;
  onFilterChange?: (filter: string) => void;
  onSearch?: (query: string) => void;
}

const DeviceGrid = ({
  devices = [
    {
      id: "DEV-1001",
      name: "Temperature Sensor A",
      status: "online",
      lastActivity: "2023-06-15T14:30:00",
      type: "Temperature Sensor",
      data: { temperature: 24.5, humidity: 45, battery: 78 },
    },
    {
      id: "DEV-1002",
      name: "Humidity Monitor B",
      status: "offline",
      lastActivity: "2023-06-14T09:15:00",
      type: "Humidity Sensor",
      data: { temperature: 22.0, humidity: 60, battery: 32 },
    },
    {
      id: "DEV-1003",
      name: "Smart Gateway C",
      status: "online",
      lastActivity: "2023-06-15T16:45:00",
      type: "Gateway",
      data: { temperature: 26.8, humidity: 50, battery: 92 },
    },
    {
      id: "DEV-1004",
      name: "Motion Detector D",
      status: "maintenance",
      lastActivity: "2023-06-13T11:20:00",
      type: "Motion Sensor",
      data: { temperature: 23.1, humidity: 48, battery: 45 },
    },
    {
      id: "DEV-1005",
      name: "Air Quality Monitor E",
      status: "online",
      lastActivity: "2023-06-15T15:10:00",
      type: "Air Quality Sensor",
      data: { temperature: 25.2, humidity: 52, battery: 85 },
    },
    {
      id: "DEV-1006",
      name: "Smart Thermostat F",
      status: "online",
      lastActivity: "2023-06-15T13:25:00",
      type: "Thermostat",
      data: { temperature: 21.5, humidity: 40, battery: 90 },
    },
  ],
  isLoading = false,
  onAddDevice = () => console.log("Add device clicked"),
  onRefresh = () => console.log("Refresh clicked"),
  onFilterChange = (filter) => console.log("Filter changed:", filter),
  onSearch = (query) => console.log("Search query:", query),
}: DeviceGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="w-full bg-background p-4 rounded-lg border border-border">
      <div className="flex flex-col space-y-4 animate-fadeIn">
        {/* Header with title and add button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">IoT Devices</h2>
          <Button
            onClick={onAddDevice}
            className="btn-modern shadow-lg smooth-transition hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 shadow-lg smooth-transition focus:shadow-xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={activeFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] shadow-lg smooth-transition hover:shadow-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="shadow-lg">
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={onRefresh}
              className="shadow-lg smooth-transition hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs for different device views */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4 shadow-lg">
            <TabsTrigger value="grid" className="smooth-transition">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="smooth-transition">
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : devices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">No devices found</p>
                <Button variant="outline" onClick={onAddDevice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Device
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {devices.map((device) => (
                  <div key={device.id} className="animate-fadeIn">
                    <DeviceCard
                      id={device.id}
                      name={device.name}
                      status={device.status}
                      lastActivity={device.lastActivity}
                      type={device.type}
                      data={device.data}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="w-full">
            <div className="border rounded-md shadow-lg">
              <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
                <div>Device Name</div>
                <div>Type</div>
                <div>Status</div>
                <div>Last Activity</div>
                <div>Actions</div>
              </div>
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                >
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {device.type}
                  </div>
                  <div>
                    {device.status === "online" && (
                      <Badge variant="default" className="bg-green-500">
                        Online
                      </Badge>
                    )}
                    {device.status === "offline" && (
                      <Badge variant="destructive">Offline</Badge>
                    )}
                    {device.status === "maintenance" && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500 text-black"
                      >
                        Maintenance
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(device.lastActivity).toLocaleString()}
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-lg smooth-transition hover:shadow-xl hover:bg-primary/10"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeviceGrid;
