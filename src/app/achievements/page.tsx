"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Star,
  Target,
  Zap,
  Medal,
  Crown,
  Lock,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { achievementsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<{
    earned: any[];
    inProgress: any[];
    available: any[];
  }>({ earned: [], inProgress: [], available: [] });
  const [level, setLevel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "earned" | "inProgress">("all");

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const [achievementsData, levelData] = await Promise.all([
        achievementsApi.getMyAchievements(token),
        achievementsApi.getLevelInfo(token),
      ]);

      setAchievements(achievementsData);
      setLevel(levelData);
    } catch (error) {
      console.error("Failed to load achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      workouts: Trophy,
      streaks: Flame,
      milestones: Star,
      challenges: Target,
      special: Crown,
    };
    return icons[category] || Medal;
  };

  const filteredAchievements =
    activeTab === "all"
      ? [...achievements.earned, ...achievements.inProgress]
      : activeTab === "earned"
      ? achievements.earned
      : achievements.inProgress;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Achievements</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Your{" "}
              <span className="gradient-text-accent">Fitness Journey</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto">
              Complete challenges, earn badges, and level up as you pursue your fitness goals.
            </p>
          </motion.div>

          {/* Level Progress */}
          {level && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Current Level</p>
                    <p className="text-3xl font-bold">Level {level.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Total Points</p>
                  <p className="text-2xl font-bold">{level.totalPoints.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {level.level + 1}</span>
                  <span>{level.pointsNeeded} points needed</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${level.progressPercent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Earned", value: achievements.earned.length, icon: Trophy },
              { label: "In Progress", value: achievements.inProgress.length, icon: Target },
              { label: "Available", value: achievements.available.length, icon: Lock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="card text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card-hover mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(["all", "earned", "inProgress"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-colors",
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-card text-muted hover:text-white border border-border"
                )}
              >
                {tab === "inProgress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAchievements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement: any, index: number) => {
                const Icon = getCategoryIcon(achievement.category);
                const isEarned = achievements.earned.some(
                  (e) => e.achievement_id === achievement.achievement_id || e.id === achievement.id
                );

                return (
                  <motion.div
                    key={achievement.id || achievement.achievement_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "card relative overflow-hidden",
                      isEarned
                        ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"
                        : ""
                    )}
                  >
                    {isEarned && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                        isEarned
                          ? "bg-amber-500/20"
                          : "bg-card-hover"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-7 h-7",
                          isEarned ? "text-amber-400" : "text-muted"
                        )}
                      />
                    </div>

                    <h3 className="font-semibold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-muted mb-4">
                      {achievement.description}
                    </p>

                    {!isEarned && achievement.current_progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Progress</span>
                          <span>
                            {achievement.current_progress} /{" "}
                            {achievement.requirement_value}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${Math.min(
                                100,
                                (achievement.current_progress /
                                  achievement.requirement_value) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {isEarned && achievement.earned_at && (
                      <p className="text-xs text-muted mt-4">
                        Earned on{" "}
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-amber-400">+{achievement.points} points</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
              <p className="text-muted">Start working out to unlock achievements!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
