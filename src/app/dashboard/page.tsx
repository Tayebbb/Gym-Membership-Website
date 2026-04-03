"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Dumbbell,
  MapPin,
  Calendar,
  Trophy,
  Flame,
  TrendingUp,
  Clock,
  Activity,
  ArrowRight,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { authApi, workoutsApi, userApi } from "@/lib/api";
import { formatDuration, formatNumber } from "@/lib/utils";

interface DashboardStats {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  totalCalories: number;
}

interface Activity {
  recentWorkouts: any[];
  recentCheckIns: any[];
  upcomingClasses: any[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    totalCalories: 0,
  });
  const [activity, setActivity] = useState<Activity>({
    recentWorkouts: [],
    recentCheckIns: [],
    upcomingClasses: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const [userData, workoutStats, activityData] = await Promise.all([
        authApi.getMe(token),
        workoutsApi.getStats(token),
        userApi.getActivity(token),
      ]);

      setUser(userData.user);
      setStats({
        totalWorkouts: workoutStats.stats?.total_workouts || 0,
        totalMinutes: workoutStats.stats?.total_minutes || 0,
        currentStreak: userData.user.stats?.current_streak_days || 0,
        totalCalories: workoutStats.stats?.total_calories_burned || 0,
      });
      setActivity(activityData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      icon: MapPin,
      label: "Find Gym",
      href: "/gyms",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      icon: Dumbbell,
      label: "Log Workout",
      href: "/workouts/new",
      color: "bg-primary/20 text-primary",
    },
    {
      icon: Calendar,
      label: "Book Class",
      href: "/classes",
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      icon: Trophy,
      label: "Achievements",
      href: "/achievements",
      color: "bg-amber-500/20 text-amber-400",
    },
  ];

  const statCards = [
    {
      icon: Dumbbell,
      label: "Total Workouts",
      value: stats.totalWorkouts,
      trend: "+12%",
    },
    {
      icon: Clock,
      label: "Minutes Active",
      value: formatDuration(stats.totalMinutes),
      trend: "+8%",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: stats.currentStreak,
      trend: "Current",
    },
    {
      icon: Activity,
      label: "Calories Burned",
      value: formatNumber(stats.totalCalories),
      trend: "+15%",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{user ? `, ${user.firstName}` : ""}!
            </h1>
            <p className="text-muted">
              Here&apos;s your fitness summary for today
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="card flex flex-col items-center text-center p-6 hover:border-primary/50"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-card-hover rounded-xl">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="card h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Link
                    href="/workouts"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {activity.recentWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {activity.recentWorkouts.slice(0, 5).map((workout: any) => (
                      <div
                        key={workout.id}
                        className="flex items-center gap-4 p-4 bg-card-hover rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-muted">
                            {workout.workout_type} &bull; {formatDuration(workout.duration_minutes)}
                          </p>
                        </div>
                        <span className="text-sm text-muted">
                          {new Date(workout.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Dumbbell className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">No workouts yet. Start your fitness journey!</p>
                    <Link
                      href="/workouts/new"
                      className="btn-primary mt-4 inline-flex items-center gap-2"
                    >
                      Log Workout
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Upcoming Classes</h2>
                  <Link
                    href="/classes"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {activity.upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {activity.upcomingClasses.slice(0, 3).map((booking: any) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-card-hover rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{booking.class_name}</p>
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                            {booking.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted mb-2">{booking.gym_name}</p>
                        <p className="text-sm">
                          {new Date(booking.start_time).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">No upcoming classes booked</p>
                    <Link
                      href="/classes"
                      className="btn-primary mt-4 inline-flex items-center gap-2"
                    >
                      Browse Classes
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
