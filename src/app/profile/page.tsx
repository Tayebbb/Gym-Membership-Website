"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Check,
  X,
  Loader2,
  Camera,
  MapPin,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { userApi, authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await authApi.getMe(token);
      setUser(response.user);
      setFormData({
        firstName: response.user.firstName || "",
        lastName: response.user.lastName || "",
        email: response.user.email || "",
        phone: response.user.phone || "",
        dateOfBirth: response.user.dateOfBirth || "",
        gender: response.user.gender || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);
    try {
      await userApi.updateProfile(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        },
        token
      );
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const statCards = [
    { label: "Workouts", value: user?.stats?.total_workouts || 0, icon: Award },
    { label: "Check-ins", value: user?.stats?.total_check_ins || 0, icon: MapPin },
    { label: "Level", value: user?.stats?.level || 1, icon: Award },
    { label: "Points", value: user?.stats?.total_points || 0, icon: Award },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white"
                >
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-card rounded-full border border-border hover:bg-card-hover transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-muted mb-4">{user?.email}</p>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card-hover rounded-lg hover:bg-card transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          dateOfBirth: user?.dateOfBirth || "",
                          gender: user?.gender || "",
                        });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-card-hover rounded-lg hover:bg-card transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="label">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                    <User className="w-5 h-5 text-muted" />
                    <span>{user?.firstName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                    <User className="w-5 h-5 text-muted" />
                    <span>{user?.lastName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Email</label>
                <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                  <Mail className="w-5 h-5 text-muted" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div>
                <label className="label">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                    <Phone className="w-5 h-5 text-muted" />
                    <span>{user?.phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                    <Calendar className="w-5 h-5 text-muted" />
                    <span>
                      {user?.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Gender</label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-card-hover rounded-lg">
                    <User className="w-5 h-5 text-muted" />
                    <span className="capitalize">
                      {user?.gender || "Not provided"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
