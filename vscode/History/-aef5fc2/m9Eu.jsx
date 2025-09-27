"use client";

import SearchBar from "@/components/globals/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  HardDrive,
  Server,
  Shield,
  Terminal,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState("online");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const devStats = [
    {
      title: "API Calls",
      value: "124K",
      change: "+15%",
      icon: Zap,
      color: "bg-yellow-500",
      status: "active",
    },
    {
      title: "Database Queries",
      value: "45.2K",
      change: "+8%",
      icon: Database,
      color: "bg-blue-500",
      status: "normal",
    },
    {
      title: "Server Uptime",
      value: "99.9%",
      change: "+0.1%",
      icon: Server,
      color: "bg-green-500",
      status: "excellent",
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "bg-purple-500",
      status: "growing",
    },
  ];

  const serverMetrics = [
    { label: "CPU Usage", value: "45%", color: "bg-blue-500", icon: Cpu },
    { label: "Memory", value: "67%", color: "bg-green-500", icon: HardDrive },
    { label: "Network", value: "23%", color: "bg-purple-500", icon: Wifi },
    { label: "Security", value: "100%", color: "bg-red-500", icon: Shield },
  ];

  const recentLogs = [
    {
      time: "10:45:23",
      level: "INFO",
      message: "API endpoint /users successfully accessed",
      type: "success",
    },
    {
      time: "10:44:15",
      level: "WARN",
      message: "Database connection pool at 80% capacity",
      type: "warning",
    },
    {
      time: "10:42:08",
      level: "ERROR",
      message: "Failed authentication attempt from IP 192.168.1.100",
      type: "error",
    },
    {
      time: "10:40:33",
      level: "INFO",
      message: "New deployment completed successfully",
      type: "success",
    },
  ];

  const codeStats = [
    { language: "JavaScript", lines: "125K", percentage: 45 },
    { language: "Python", lines: "89K", percentage: 32 },
    { language: "TypeScript", lines: "67K", percentage: 23 },
  ];

  return (
    <div className="bg-background flex min-h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-border bg-card border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">Developer Dashboard</h2>

              {/* Current Time */}
              <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
                <Clock size={14} className="text-primary" />
                <span>
                  {currentTime.toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                    hour12: true,
                  })}
                </span>
              </div>

              {/* System Status */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  isOnline
                    ? "bg-green-900/80 text-green-300"
                    : "bg-red-900/80 text-red-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? "animate-pulse bg-green-400" : "bg-red-400"
                  }`}
                />
                <span>System {systemStatus}</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <SearchBar />

              {/* Notifications */}
              <div className="relative cursor-pointer">
                <Bell className="text-muted-foreground h-6 w-6 transition-colors hover:text-blue-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
              </div>

              {/* Profile Avatar */}
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white transition-all hover:shadow-lg">
                D
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="bg-card/50 flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 text-white">
              <div className="relative z-10">
                <h1 className="animate-fade-in mb-2 text-3xl font-bold">
                  Welcome Back, Developer!
                </h1>
                <p className="text-blue-100">
                  System running smoothly • All services operational • Ready for
                  deployment
                </p>
              </div>
              <div className="bg-opacity-10 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 transform rounded-full bg-white"></div>
            </div>
          </div>

          {/* Dev Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {devStats.map((stat, index) => (
              <Card key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <CardTitle className="mt-1 text-2xl font-bold text-white">
                        {stat.value}
                      </CardTitle>
                      <p
                        className={`mt-2 text-sm ${
                          stat.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {stat.change} from last hour
                      </p>
                    </div>
                    <div className={`${stat.color} rounded-lg p-3`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Server Metrics */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Server className="mr-2 text-blue-400" size={20} />
                  Server Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serverMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <metric.icon
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="text-muted-foreground text-sm">
                          {metric.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-muted h-2 w-20 overflow-hidden rounded-full">
                          <div
                            className={`h-full ${metric.color} transition-all duration-500`}
                            style={{ width: metric.value }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Code Statistics */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <FileCode className="mr-2 text-green-400" size={20} />
                  Code Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {codeStats.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {lang.language}
                        </span>
                        <span>{lang.lines}</span>
                      </div>
                      <div className="bg-muted h-2 w-full rounded-full">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-700"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Zap className="mr-2 text-yellow-400" size={20} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "Deploy",
                      icon: GitBranch,
                      color: "bg-green-600 hover:bg-green-700",
                    },
                    {
                      name: "Rollback",
                      icon: AlertCircle,
                      color: "bg-red-600 hover:bg-red-700",
                    },
                    {
                      name: "DB Backup",
                      icon: Database,
                      color: "bg-blue-600 hover:bg-blue-700",
                    },
                    {
                      name: "Terminal",
                      icon: Terminal,
                      color: "bg-purple-600 hover:bg-purple-700",
                    },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className={`${action.color} flex transform flex-col items-center space-y-1 rounded-lg p-3 text-white transition-all duration-200 hover:scale-105`}
                    >
                      <action.icon size={20} />
                      <span className="text-xs font-medium">{action.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Logs */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Terminal className="mr-2 text-blue-400" size={20} />
                Recent System Logs
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                {recentLogs.map((log, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted-foreground/10 flex items-center space-x-4 rounded px-2 py-1 transition-colors"
                  >
                    {/* Time */}
                    <span className="text-muted-foreground">{log.time}</span>

                    {/* Level Badge */}
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        log.type === "success"
                          ? "bg-green-900 text-green-300"
                          : log.type === "warning"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                      }`}
                    >
                      {log.level}
                    </span>

                    {/* Message */}
                    <span className="text-foreground flex-1">
                      {log.message}
                    </span>

                    {/* Icon */}
                    {log.type === "success" && (
                      <CheckCircle size={16} className="text-green-400" />
                    )}
                    {log.type === "warning" && (
                      <AlertCircle size={16} className="text-yellow-400" />
                    )}
                    {log.type === "error" && (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
