"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import GymCard from "@/components/GymCard";
import { gymsApi } from "@/lib/api";

const amenities = [
  "Cardio Equipment",
  "Free Weights",
  "Pool",
  "Sauna",
  "Group Classes",
  "Personal Training",
  "24/7 Access",
  "Parking",
];

export default function GymsPage() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    try {
      const response = await gymsApi.getAll();
      setGyms(response.gyms);
    } catch (error) {
      console.error("Failed to load gyms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredGyms = gyms.filter((gym: any) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) =>
        gym.amenities?.includes(amenity)
      );

    return matchesSearch && matchesAmenities;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Find Your Perfect{" "}
              <span className="gradient-text">Gym</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto">
              Browse over 500 premium fitness centers in your area. All gyms are
              included with your FitPass membership.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gyms by name or city..."
                className="input pl-12 pr-4"
              />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || selectedAmenities.length > 0
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {selectedAmenities.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                  {selectedAmenities.length}
                </span>
              )}
            </button>

            <div className="flex-1" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-border rounded-lg px-4 py-2 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Amenities Filter */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 bg-card rounded-2xl border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Amenities</h3>
                {selectedAmenities.length > 0 && (
                  <button
                    onClick={() => setSelectedAmenities([])}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? "bg-primary text-white"
                        : "bg-card-hover text-muted hover:text-white"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted">
              Showing {filteredGyms.length} gym
              {filteredGyms.length !== 1 && "s"}
            </p>
          </div>
        </div>
      </div>

      {/* Gyms Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="aspect-16/10 skeleton rounded-xl mb-4" />
                  <div className="h-6 skeleton rounded w-3/4 mb-2" />
                  <div className="h-4 skeleton rounded w-1/2 mb-4" />
                  <div className="h-10 skeleton rounded" />
                </div>
              ))}
            </div>
          ) : filteredGyms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGyms.map((gym: any, index) => (
                <motion.div
                  key={gym.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GymCard
                    id={gym.id}
                    name={gym.name}
                    address={gym.address}
                    city={gym.city}
                    rating={gym.rating || gym.avg_rating || 0}
                    reviewCount={gym.review_count || 0}
                    memberCount={gym.member_count || 0}
                    baseMonthlyFee={gym.base_monthly_fee}
                    amenities={gym.amenities || []}
                    isFeatured={gym.is_featured}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No gyms found</h3>
              <p className="text-muted">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
