"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Clock, Users, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";

interface GymCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  memberCount: number;
  baseMonthlyFee: number;
  amenities: string[];
  images?: string[];
  isFeatured?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  compact?: boolean;
}

export default function GymCard({
  id,
  name,
  address,
  city,
  rating,
  reviewCount,
  memberCount,
  baseMonthlyFee,
  amenities = [],
  images,
  isFeatured,
  isFavorite,
  onFavoriteToggle,
  compact = false,
}: GymCardProps) {
  const displayedAmenities = amenities.slice(0, compact ? 3 : 4);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bg-card rounded-2xl overflow-hidden border border-border transition-all",
        "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
        isFeatured && "ring-2 ring-primary/20"
      )}
    >
      {/* Image */}
      <div className="relative aspect-16/10 bg-card-hover">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all",
              isFavorite
                ? "bg-primary text-white"
                : "bg-card/80 text-muted hover:text-primary"
            )}
          >
            <Heart
              className={cn("w-5 h-5", isFavorite && "fill-current")}
            />
          </button>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          <span className="text-muted text-sm">({reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/gyms/${id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-start gap-2 text-muted text-sm mb-4">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {address}, {city}
          </span>
        </div>

        {!compact && (
          <>
            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1 text-muted">
                <Users className="w-4 h-4" />
                <span>{memberCount} members</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {displayedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs px-2 py-1 bg-card-hover rounded-full text-muted"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > displayedAmenities.length && (
                <span className="text-xs px-2 py-1 bg-card-hover rounded-full text-muted">
                  +{amenities.length - displayedAmenities.length} more
                </span>
              )}
            </div>
          </>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold">{formatCurrency(baseMonthlyFee)}</p>
            <p className="text-xs text-muted">/month</p>
          </div>
          <Link
            href={`/gyms/${id}`}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
