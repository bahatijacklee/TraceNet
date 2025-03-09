import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Activity, Settings, Power, Info, MoreVertical } from "lucide-react";

interface DeviceCardProps {
  id?: string;
  name?: string;
  status?: "online" | "offline" | "maintenance";
  lastActivity?: string;
  type?: string;
  data?: {
    temperature?: number;
    humidity?: number;
    battery?: number;
  };
}

const DeviceCard = ({
  id = "DEV-1234",
  name = "Smart Sensor",
  status = "online",
  lastActivity = "2023-06-15T14:30:00",
  type = "Temperature Sensor",
  data = {
    temperature: 24.5,
    humidity: 45,
    battery: 78,
  },
}: DeviceCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Determine status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        );
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "maintenance":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-black">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-[320px] h-[180px] overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-xs">
              {id} • {type}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusBadge(status)}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <Activity className="h-4 w-4 mb-1 text-blue-500" />
            <span className="font-medium">{data.temperature}°C</span>
            <span className="text-xs text-muted-foreground">Temp</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <Info className="h-4 w-4 mb-1 text-blue-500" />
            <span className="font-medium">{data.humidity}%</span>
            <span className="text-xs text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <Power className="h-4 w-4 mb-1 text-blue-500" />
            <span className="font-medium">{data.battery}%</span>
            <span className="text-xs text-muted-foreground">Battery</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 justify-between">
        <div className="text-xs text-muted-foreground">
          Last active: {formatDate(lastActivity)}
        </div>
        <Button variant="outline" size="sm" className="h-7">
          <Settings className="h-3 w-3 mr-1" />
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
