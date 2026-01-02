"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Route,
  Shield,
  AlertTriangle,
  Search,
  ChevronRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import fetchAPI from "../utils/fetchAPI";

type Trip = {
  _id: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  safetyScore: number;
  alerts: number;
  startedAt: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await fetchAPI<Trip[]>("/api/history");
        setTrips(data);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout title="Trip History">
        <div className="p-6 text-center text-muted-foreground">
          Loading trip history...
        </div>
      </DashboardLayout>
    );
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.startLocation
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trip.endLocation
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Trip History" showSearch>
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Route className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{trips.length}</p>
                  <p className="text-xs text-muted-foreground">Total Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-safe/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-safe" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {trips.reduce((a, t) => a + t.distance, 0).toFixed(0)} km
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Distance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {trips.length > 0
                      ? Math.round(
                          trips.reduce(
                            (a, t) => a + t.safetyScore,
                            0
                          ) / trips.length
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avg Safety
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {trips.reduce((a, t) => a + t.alerts, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Alerts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trips" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="trips">Trips</TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="trips" className="space-y-4">
            {filteredTrips.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Route className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No trips found
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTrips.map((trip) => (
                <Card
                  key={trip._id}
                  className="hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-safe shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {trip.startLocation}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {trip.endLocation}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Route className="w-3 h-3" />
                            {trip.distance} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {trip.duration} min
                          </span>
                          <span>
                            {formatDistanceToNow(
                              new Date(trip.startedAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={cn(
                            "text-lg font-bold",
                            trip.safetyScore >= 90
                              ? "text-safe"
                              : trip.safetyScore >= 70
                              ? "text-warning"
                              : "text-danger"
                          )}
                        >
                          {trip.safetyScore}%
                        </div>
                        {trip.alerts > 0 && (
                          <Badge variant="secondary">
                            {trip.alerts} alert
                            {trip.alerts > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
