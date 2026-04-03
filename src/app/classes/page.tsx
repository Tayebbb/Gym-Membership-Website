"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  Filter,
  Check,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { classesApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Yoga",
  "HIIT",
  "Strength",
  "Cardio",
  "Pilates",
  "Boxing",
  "Dance",
];

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classesApi.getAll();
      setClasses(response.classes);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (classId: string) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setBookingInProgress(classId);
    try {
      await classesApi.book(classId, token);
      // Reload classes to update availability
      await loadClasses();
    } catch (error) {
      console.error("Failed to book class:", error);
    } finally {
      setBookingInProgress(null);
    }
  };

  const filteredClasses =
    selectedCategory === "All"
      ? classes
      : classes.filter((c: any) => c.category === selectedCategory);

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
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Book a Class</h1>
                <p className="text-muted">
                  Reserve your spot in fitness classes near you
                </p>
              </div>

              <Link
                href="/classes/my-bookings"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                My Bookings
              </Link>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
          >
            <Filter className="w-5 h-5 text-muted flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-card text-muted hover:text-white border border-border"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Classes Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card h-64">
                  <div className="skeleton h-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem: any, index: number) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-medium text-primary mb-1 block">
                        {classItem.category}
                      </span>
                      <h3 className="font-semibold text-lg">{classItem.class_name}</h3>
                    </div>
                    {classItem.difficulty_level && (
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          classItem.difficulty_level === "beginner" &&
                            "bg-green-500/20 text-green-400",
                          classItem.difficulty_level === "intermediate" &&
                            "bg-yellow-500/20 text-yellow-400",
                          classItem.difficulty_level === "advanced" &&
                            "bg-red-500/20 text-red-400"
                        )}
                      >
                        {classItem.difficulty_level}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted mb-4 line-clamp-2">
                    {classItem.class_description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(classItem.start_time).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Clock className="w-4 h-4" />
                      <span>{classItem.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin className="w-4 h-4" />
                      <span>{classItem.gym_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Users className="w-4 h-4" />
                      <span>
                        {classItem.available_slots} spots left
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(classItem.id)}
                    disabled={
                      classItem.available_slots === 0 ||
                      bookingInProgress === classItem.id
                    }
                    className={cn(
                      "w-full py-2 rounded-lg font-medium transition-colors",
                      classItem.available_slots === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "btn-primary"
                    )}
                  >
                    {bookingInProgress === classItem.id ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : classItem.available_slots === 0 ? (
                      "Class Full"
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No classes found</h3>
              <p className="text-muted">
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
