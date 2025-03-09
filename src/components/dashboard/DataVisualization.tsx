import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";

interface DataVisualizationProps {
  deviceData?: {
    temperatureHistory?: Array<{ timestamp: string; value: number }>;
    humidityHistory?: Array<{ timestamp: string; value: number }>;
    batteryHistory?: Array<{ timestamp: string; value: number }>;
    statusDistribution?: {
      online: number;
      offline: number;
      maintenance: number;
    };
    deviceTypes?: {
      [key: string]: number;
    };
  };
  isLoading?: boolean;
  timeRange?: "day" | "week" | "month" | "year";
}

const DataVisualization = ({
  deviceData = {
    temperatureHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      value: 20 + Math.random() * 10,
    })),
    humidityHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      value: 40 + Math.random() * 20,
    })),
    batteryHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      value: 70 + Math.random() * 30,
    })),
    statusDistribution: {
      online: 42,
      offline: 7,
      maintenance: 3,
    },
    deviceTypes: {
      "Temperature Sensor": 18,
      "Humidity Sensor": 12,
      "Motion Detector": 8,
      "Smart Switch": 14,
    },
  },
  isLoading = false,
  timeRange = "day",
}: DataVisualizationProps) => {
  // Mock chart components - in a real implementation, you would use a charting library
  const TemperatureChart = () => (
    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-end px-4 pb-4">
        {deviceData.temperatureHistory?.map((point, index) => {
          const height = `${(point.value - 15) * 8}px`;
          return (
            <div
              key={index}
              className="flex-1 mx-[1px] bg-orange-500/80 rounded-t-sm"
              style={{ height }}
              title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value.toFixed(1)}°C`}
            />
          );
        })}
      </div>
      <LineChart className="w-16 h-16 text-orange-500/20 absolute" />
    </div>
  );

  const HumidityChart = () => (
    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-end px-4 pb-4">
        {deviceData.humidityHistory?.map((point, index) => {
          const height = `${point.value * 2}px`;
          return (
            <div
              key={index}
              className="flex-1 mx-[1px] bg-blue-500/80 rounded-t-sm"
              style={{ height }}
              title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <LineChart className="w-16 h-16 text-blue-500/20 absolute" />
    </div>
  );

  const BatteryChart = () => (
    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-end px-4 pb-4">
        {deviceData.batteryHistory?.map((point, index) => {
          const height = `${point.value * 2}px`;
          return (
            <div
              key={index}
              className="flex-1 mx-[1px] bg-green-500/80 rounded-t-sm"
              style={{ height }}
              title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <LineChart className="w-16 h-16 text-green-500/20 absolute" />
    </div>
  );

  const StatusDistributionChart = () => {
    const total = Object.values(deviceData.statusDistribution || {}).reduce(
      (sum, value) => sum + value,
      0,
    );
    return (
      <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center relative">
        <div className="w-32 h-32 rounded-full border-8 border-muted relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-8 border-green-500"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + (50 * (deviceData.statusDistribution?.online || 0)) / total}% 0%)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-8 border-red-500"
            style={{
              clipPath: `polygon(50% 50%, ${50 + (50 * (deviceData.statusDistribution?.online || 0)) / total}% 0%, 100% ${50 - (50 * (deviceData.statusDistribution?.offline || 0)) / total}%)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-8 border-yellow-500"
            style={{
              clipPath: `polygon(50% 50%, 100% ${50 - (50 * (deviceData.statusDistribution?.offline || 0)) / total}%, 100% 100%)`,
            }}
          />
          <PieChart className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-around text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            <span>Online ({deviceData.statusDistribution?.online || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <span>Offline ({deviceData.statusDistribution?.offline || 0})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
            <span>
              Maintenance ({deviceData.statusDistribution?.maintenance || 0})
            </span>
          </div>
        </div>
      </div>
    );
  };

  const DeviceTypesChart = () => {
    const deviceTypes = deviceData.deviceTypes || {};
    const total = Object.values(deviceTypes).reduce(
      (sum, value) => sum + value,
      0,
    );
    const colors = [
      "bg-indigo-500",
      "bg-pink-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-cyan-500",
    ];

    return (
      <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center relative p-4">
        <div className="w-full h-full flex flex-col justify-end">
          {Object.entries(deviceTypes).map(([type, count], index) => {
            const percentage = (count / total) * 100;
            return (
              <div key={type} className="flex items-center mb-2">
                <div className="w-24 truncate text-xs">{type}</div>
                <div className="flex-1 h-6 bg-muted/50 rounded-sm overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-10 text-xs text-right ml-2">{count}</div>
              </div>
            );
          })}
        </div>
        <BarChart className="w-16 h-16 text-muted-foreground/20 absolute opacity-20" />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-[1000px] h-[300px] bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Device Analytics
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm">
              <Button variant="outline" size="sm" className="h-8">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="battery">Battery</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="types">Device Types</TabsTrigger>
          </TabsList>
          <TabsContent value="temperature" className="mt-0">
            <TemperatureChart />
          </TabsContent>
          <TabsContent value="humidity" className="mt-0">
            <HumidityChart />
          </TabsContent>
          <TabsContent value="battery" className="mt-0">
            <BatteryChart />
          </TabsContent>
          <TabsContent value="status" className="mt-0">
            <StatusDistributionChart />
          </TabsContent>
          <TabsContent value="types" className="mt-0">
            <DeviceTypesChart />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0 justify-between text-xs text-muted-foreground">
        <div>Last updated: {new Date().toLocaleString()}</div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Day
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Week
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Month
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataVisualization;
