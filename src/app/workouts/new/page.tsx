"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  Clock,
  Flame,
  ChevronLeft,
  Plus,
  X,
  Loader2,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { workoutsApi } from "@/lib/api";

const workoutTypes = [
  "Cardio",
  "Strength",
  "HIIT",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Swimming",
  "Cycling",
  "Running",
  "Other",
];

const intensityLevels = ["low", "moderate", "high", "extreme"];

export default function NewWorkoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<any[]>([
    { name: "", sets: 3, reps: 10, weight: 0 },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    workoutType: "Strength",
    durationMinutes: "",
    caloriesBurned: "",
    intensityLevel: "moderate",
    mood: "",
    notes: "",
  });

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await workoutsApi.create(
        {
          name: formData.name,
          workoutType: formData.workoutType,
          durationMinutes: parseInt(formData.durationMinutes),
          caloriesBurned: parseInt(formData.caloriesBurned) || 0,
          exercises: exercises.filter((e) => e.name),
          intensityLevel: formData.intensityLevel,
          mood: formData.mood,
          notes: formData.notes,
        },
        token
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Log Workout</h1>
                <p className="text-muted">Track your progress and earn points</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workout Name */}
              <div>
                <label className="label">Workout Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Upper Body Strength"
                  required
                />
              </div>

              {/* Workout Type */}
              <div>
                <label className="label">Workout Type *</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {workoutTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, workoutType: type })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.workoutType === type
                          ? "bg-primary text-white"
                          : "bg-card-hover text-muted hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Calories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Duration (minutes) *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({ ...formData, durationMinutes: e.target.value })
                      }
                      className="input pl-12"
                      placeholder="45"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Calories Burned</label>
                  <div className="relative">
                    <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="number"
                      value={formData.caloriesBurned}
                      onChange={(e) =>
                        setFormData({ ...formData, caloriesBurned: e.target.value })
                      }
                      className="input pl-12"
                      placeholder="300"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="label">Intensity Level</label>
                <div className="flex gap-2">
                  {intensityLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, intensityLevel: level })
                      }
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        formData.intensityLevel === level
                          ? "bg-primary text-white"
                          : "bg-card-hover text-muted hover:text-white"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="label mb-0">Exercises</label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Exercise
                  </button>
                </div>

                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 bg-card-hover rounded-xl"
                    >
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(index, "name", e.target.value)
                        }
                        className="input flex-1"
                        placeholder="Exercise name"
                      />
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(index, "sets", parseInt(e.target.value))
                        }
                        className="input w-20"
                        placeholder="Sets"
                        min="1"
                      />
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(index, "reps", parseInt(e.target.value))
                        }
                        className="input w-20"
                        placeholder="Reps"
                        min="1"
                      />
                      <input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) =>
                          updateExercise(index, "weight", parseFloat(e.target.value))
                        }
                        className="input w-24"
                        placeholder="Weight"
                        min="0"
                        step="0.5"
                      />
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input min-h-[100px] resize-none"
                  placeholder="How did the workout feel? Any personal records?"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="btn-secondary flex-1 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trophy className="w-5 h-5" />
                      Save Workout
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
