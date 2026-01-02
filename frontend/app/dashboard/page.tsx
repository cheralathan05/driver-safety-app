"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { RiskMeter } from "@/components/ui/risk-meter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Route,
  Clock,
  Shield,
  TrendingUp,
  Play,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import fetchAPI from "../utils/fetchAPI";

/* -------------------- Types -------------------- */

type User = {
  _id: string;
  name?: string;
  email?: string;
};

type Trip = {
  distance?: number;
  duration?: number;
};

/* -------------------- Static Chart Data -------------------- */

const safetyScoreData = [
  { day: "Mon", score: 85 },
  { day: "Tue", score: 88 },
  { day: "Wed", score: 82 },
  { day: "Thu", score: 90 },
  { day: "Fri", score: 87 },
  { day: "Sat", score: 92 },
  { day: "Sun", score: 89 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔐 Load logged-in user */
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchAPI<User>("/api/user/me");
        setUser(data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <h2 className="text-center text-lg font-semibold mt-20">
        Loading dashboard...
      </h2>
    );
  }

  if (!user) return null;

  /* -------------------- Temporary Data -------------------- */

  const trips: Trip[] = [];
  const alerts: unknown[] = [];
  const isMonitoring = false;
  const riskLevel = "safe";

  const stats = {
    totalTrips: trips.length || 12,
    totalDistance:
      trips.reduce((a, t) => a + (t.distance || 0), 0) || 847,
    totalDuration:
      trips.reduce((a, t) => a + (t.duration || 0), 0) || 42,
    averageSafetyScore: 87,
    alertsThisWeek: alerts.length || 3,
  };

  const firstName = user.name?.split(" ")[0] || "Driver";

  const logout = async () => {
    await fetchAPI("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <DashboardLayout title={`Dashboard – Welcome ${firstName}`} showSearch>
      <div className="p-4 md:p-6 space-y-6">

        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Welcome back, {firstName} 👋
                </h2>
                <p className="text-muted-foreground">
                  Ready for your next safe trip?
                </p>
              </div>
              <Button size="lg" className="gap-2" onClick={() => router.push("/drive")}>
                <Play className="w-4 h-4" />
                Start Driving
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Trips" value={stats.totalTrips} icon={Car} />
          <StatCard title="Distance" value={`${stats.totalDistance} km`} icon={Route} />
          <StatCard title="Drive Time" value={`${stats.totalDuration}h`} icon={Clock} />
          <StatCard title="Safety Score" value={`${stats.averageSafetyScore}%`} icon={Shield} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Safety Score Trend
              </CardTitle>
              <CardDescription>This week overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ score: { label: "Safety Score", color: "var(--color-primary)" } }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={safetyScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[70, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Live monitoring</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <RiskMeter level={riskLevel} score={92} animated={isMonitoring} />
              <Badge className="mt-4">
                {isMonitoring ? "Monitoring Active" : "Monitoring Off"}
              </Badge>
              <Button className="mt-4" onClick={() => router.push("/drive")}>
                Start Monitoring
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => router.push("/drive")}>
              Start New Trip
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/history")}>
              Trip History
            </Button>
            <Button variant="destructive" className="w-full" onClick={logout}>
              Logout
            </Button>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
