"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    icon: Zap,
    price: { monthly: 29, yearly: 290 },
    description: "Perfect for occasional gym-goers",
    features: [
      "Access to 500+ gyms",
      "Standard gym hours",
      "Basic workout tracking",
      "Email support",
      "Up to 3 gym visits/week",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Premium",
    icon: Sparkles,
    price: { monthly: 59, yearly: 590 },
    description: "Best for regular fitness enthusiasts",
    features: [
      "Unlimited gym access",
      "24/7 access to all locations",
      "Advanced workout tracking",
      "Class bookings included",
      "Priority support",
      "Guest passes (2/month)",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Elite",
    icon: Crown,
    price: { monthly: 99, yearly: 990 },
    description: "For serious athletes and professionals",
    features: [
      "Everything in Premium",
      "Personal training sessions (4/month)",
      "Nutrition consultation",
      "Recovery spa access",
      "Premium equipment priority",
      "Unlimited guest passes",
      "VIP locker rooms",
      "Exclusive events",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block"
          >
            Pricing
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Simple,{" "}
            <span className="gradient-text">transparent pricing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted max-w-2xl mx-auto"
          >
            Choose the plan that fits your lifestyle. All plans include access to
            our gym network with no hidden fees.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-primary/20 to-card border-2 border-primary"
                  : "bg-card border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular ? "bg-primary" : "bg-card-hover"
                  }`}
                >
                  <plan.icon
                    className={`w-6 h-6 ${
                      plan.popular ? "text-white" : "text-primary"
                    }`}
                  />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>

              <p className="text-muted mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price.monthly}</span>
                <span className="text-muted">/month</span>
                <p className="text-sm text-muted mt-1">
                  or ${plan.price.yearly}/year (2 months free)
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? "bg-primary/20" : "bg-card-hover"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          plan.popular ? "text-primary" : "text-muted"
                        }`}
                      />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted text-sm">
            Trusted by 50,000+ members &bull; Cancel anytime &bull; 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
