"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Dumbbell,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "gyms" | "revenue">("overview");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await adminApi.getStats(token);
      setStats(response);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.users?.total || 0,
      trend: `+${stats?.users?.new || 0} new`,
      color: "bg-blue-500/20 text-blue-400",
      href: "/admin/users",
    },
    {
      icon: Dumbbell,
      label: "Active Gyms",
      value: stats?.gyms?.active || 0,
      trend: `${stats?.gyms?.total || 0} total`,
      color: "bg-primary/20 text-primary",
      href: "/admin/gyms",
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: stats?.subscriptions?.active || 0,
      trend: `${stats?.subscriptions?.past_due || 0} past due`,
      color: "bg-purple-500/20 text-purple-400",
      href: "/admin/subscriptions",
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: formatCurrency(stats?.revenue?.recent_revenue || 0),
      trend: `${formatCurrency(stats?.revenue?.total_revenue || 0)} total`,
      color: "bg-amber-500/20 text-amber-400",
      href: "/admin/revenue",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn userRole="admin" />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Admin</span>
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { label: "Add Gym", href: "/admin/gyms/new" },
              { label: "View Reports", href: "/admin/reports" },
              { label: "Manage Users", href: "/admin/users" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="btn-secondary"
              >
                {action.label}
              </Link>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={stat.href} className="card block hover:border-primary/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm text-muted">{stat.label}</p>
                        <p className="text-xs text-success mt-2">{stat.trend}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Top Performing Gyms</h2>
                    <Link href="/admin/gyms" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </div>

                  {stats?.topGyms?.length > 0 ? (
                    <div className="space-y-4">
                      {stats.topGyms.map((gym: any, index: number) => (
                        <div
                          key={gym.name}
                          className="flex items-center gap-4 p-4 bg-card-hover rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{gym.name}</p>
                            <p className="text-sm text-muted">{gym.check_in_count} check-ins</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-8">No data available</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Check-ins</h2>
                    <div className="flex items-center gap-2 text-primary">
                      <Activity className="w-5 h-5" />
                      <span className="font-semibold">
                        {formatNumber(stats?.checkIns?.recent_check_ins || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-card-hover rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Total check-ins (30 days)</span>
                        <span className="font-semibold">
                          {formatNumber(stats?.checkIns?.recent_check_ins || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-card-hover rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Active subscriptions</span>
                        <span className="font-semibold text-success">
                          {stats?.subscriptions?.active || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-card-hover rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Canceled subscriptions</span>
                        <span className="font-semibold text-muted">
                          {stats?.subscriptions?.canceled || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
