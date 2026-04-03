"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  Calendar,
  Dumbbell,
  Users,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { gymsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  amenities: string[];
  facilities: string[];
  opening_hours: Record<string, string>;
  images: string[];
  rating: number;
  review_count: number;
  member_count: number;
  base_monthly_fee: number;
  is_featured: boolean;
}

export default function GymDetailPage() {
  const params = useParams();
  const [gym, setGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "classes" | "reviews">("about");

  useEffect(() => {
    loadGym();
  }, [params.id]);

  const loadGym = async () => {
    try {
      const response = await gymsApi.getById(params.id as string);
      setGym(response.gym);
    } catch (error) {
      console.error("Failed to load gym:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="skeleton h-8 w-32 mb-4" />
            <div className="skeleton h-96 rounded-2xl mb-8" />
            <div className="skeleton h-12 w-1/2 mb-4" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Gym not found</h1>
          <Link href="/gyms" className="btn-primary">
            Browse Gyms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-20">
        {/* Image Gallery */}
        <div className="relative h-[400px] bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Dumbbell className="w-32 h-32 text-primary/30" />
          </div>

          {/* Back Button */}
          <Link
            href="/gyms"
            className="absolute top-4 left-4 z-10 p-3 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "p-3 rounded-full backdrop-blur-sm transition-colors",
                isFavorite
                  ? "bg-primary text-white"
                  : "bg-card/80 hover:bg-card"
              )}
            >
              <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
            </button>
            <button className="p-3 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {gym.is_featured && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold">{gym.rating.toFixed(1)}</span>
                      <span className="text-muted">({gym.review_count} reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-2">{gym.name}</h1>

                  <div className="flex items-start gap-2 text-muted mb-4">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      {gym.address}, {gym.city}, {gym.state} {gym.zip_code}
                    </span>
                  </div>

                  <p className="text-muted mb-6">{gym.description}</p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium">{gym.member_count} members</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">Open 24/7</span>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="lg:text-right">
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${gym.base_monthly_fee}</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <button className="btn-primary w-full lg:w-auto mb-2">
                    Join Now
                  </button>
                  <p className="text-sm text-muted">Included with Premium plan</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-8 border-t border-border pt-6">
                {(["about", "classes", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium transition-colors capitalize",
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "text-muted hover:text-white hover:bg-card-hover"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <div className="grid lg:grid-cols-3 gap-8 pb-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {activeTab === "about" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Amenities */}
                    <div className="card">
                      <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {gym.amenities?.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 text-muted"
                          >
                            <Check className="w-4 h-4 text-primary" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="card">
                      <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {gym.facilities?.map((facility) => (
                          <div
                            key={facility}
                            className="flex items-center gap-2 text-muted"
                          >
                            <Check className="w-4 h-4 text-primary" />
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="card">
                      <h2 className="text-xl font-semibold mb-4">Hours</h2>
                      <div className="space-y-2">
                        {gym.opening_hours &&
                          Object.entries(gym.opening_hours).map(([day, hours]) => (
                            <div
                              key={day}
                              className="flex justify-between py-2 border-b border-border last:border-0"
                            >
                              <span className="capitalize">{day}</span>
                              <span className="text-muted">{hours}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "classes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card"
                  >
                    <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
                    <p className="text-muted">Class schedule coming soon...</p>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card"
                  >
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    <p className="text-muted">Reviews coming soon...</p>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="card">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {gym.phone && (
                      <a
                        href={`tel:${gym.phone}`}
                        className="flex items-center gap-3 text-muted hover:text-white transition-colors"
                      >
                        <Phone className="w-5 h-5 text-primary" />
                        {gym.phone}
                      </a>
                    )}
                    {gym.email && (
                      <a
                        href={`mailto:${gym.email}`}
                        className="flex items-center gap-3 text-muted hover:text-white transition-colors"
                      >
                        <Globe className="w-5 h-5 text-primary" />
                        {gym.email}
                      </a>
                    )}
                    {gym.website && (
                      <a
                        href={gym.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-muted hover:text-white transition-colors"
                      >
                        <Globe className="w-5 h-5 text-primary" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Location Map Placeholder */}
                <div className="card">
                  <h3 className="font-semibold mb-4">Location</h3>
                  <div className="aspect-video bg-card-hover rounded-xl flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
