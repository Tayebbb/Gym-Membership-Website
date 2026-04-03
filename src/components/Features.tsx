"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  MapPin,
  Calendar,
  Trophy,
  CreditCard,
  Bell,
  Activity,
  Users,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "500+ Gym Locations",
    description:
      "Access premium fitness centers across your city. Find gyms near you with our location-based search.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: CreditCard,
    title: "One Subscription",
    description:
      "No more multiple gym memberships. One affordable plan gives you access to our entire network.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Book Classes",
    description:
      "Reserve spots in yoga, HIIT, spin, and more. Get notifications so you never miss a class.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Activity,
    title: "Track Workouts",
    description:
      "Log your exercises, track progress, and analyze your fitness journey with detailed analytics.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description:
      "Get badges, maintain streaks, and compete on leaderboards. Gamification makes fitness fun!",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get reminders for classes, payment due dates, and personalized workout suggestions.",
    color: "from-cyan-500 to-blue-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block"
          >
            Features
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Everything you need to{" "}
            <span className="gradient-text">get fit</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted max-w-2xl mx-auto"
          >
            FitPass combines the best features of fitness apps into one powerful platform.
            Track, book, and achieve your goals all in one place.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
