"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  CreditCard,
  ChevronLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { subscriptionsApi, paymentsApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "basic",
    name: "Basic",
    tier: "basic",
    price_monthly: 29,
    price_yearly: 290,
    features: [
      "Access to 500+ gyms",
      "Standard gym hours",
      "Basic workout tracking",
      "Email support",
      "Up to 3 visits/week per gym",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tier: "premium",
    price_monthly: 59,
    price_yearly: 590,
    features: [
      "Unlimited gym access",
      "24/7 access to all locations",
      "Advanced workout tracking",
      "Class bookings included",
      "Priority support",
      "Guest passes (2/month)",
      "Mobile app access",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    tier: "elite",
    price_monthly: 99,
    price_yearly: 990,
    features: [
      "Everything in Premium",
      "Personal training (4 sessions/month)",
      "Nutrition consultation",
      "Recovery spa access",
      "Premium equipment priority",
      "Unlimited guest passes",
      "VIP locker rooms",
      "Exclusive events access",
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await subscriptionsApi.getMySubscription(token);
      setCurrentSubscription(response.subscription);
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // In a real app, this would redirect to Stripe checkout
      await subscriptionsApi.create(
        { planId, billingCycle },
        token
      );
      await loadSubscription();
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleCancel = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setIsProcessing(true);
    try {
      await subscriptionsApi.cancel(true, token);
      await loadSubscription();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Failed to cancel:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResume = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setIsProcessing(true);
    try {
      await subscriptionsApi.resume(token);
      await loadSubscription();
    } catch (error) {
      console.error("Failed to resume:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
        <div className="max-w-6xl mx-auto">
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

            <h1 className="text-3xl font-bold mb-2">Your Subscription</h1>
            <p className="text-muted">
              Manage your membership plan and billing
            </p>
          </motion.div>

          {/* Current Subscription */}
          {currentSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">
                      {currentSubscription.plan_name} Plan
                    </h2>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        currentSubscription.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      )}
                    >
                      {currentSubscription.status}
                    </span>
                  </div>
                  <p className="text-muted">
                    {currentSubscription.billing_cycle === "monthly"
                      ? "Monthly billing"
                      : "Yearly billing"}{" "}
                    · Next payment on{" "}
                    {formatDate(currentSubscription.current_period_end)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      currentSubscription.billing_cycle === "monthly"
                        ? currentSubscription.price_monthly
                        : currentSubscription.price_yearly
                    )}
                    <span className="text-muted text-base font-normal">
                      /{currentSubscription.billing_cycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Subscription Actions */}
              <div className="flex flex-wrap gap-3">
                {currentSubscription.cancel_at_period_end ? (
                  <>
                    <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      <span>
                        Cancels on{" "}
                        {formatDate(currentSubscription.current_period_end)}
                      </span>
                    </div>
                    <button
                      onClick={handleResume}
                      disabled={isProcessing}
                      className="btn-secondary inline-flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Resume Subscription
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="text-error hover:underline"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>

              {/* Cancel Confirmation Modal */}
              {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="card max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Cancel Subscription?
                    </h3>
                    <p className="text-muted mb-6">
                      Your subscription will remain active until{" "}
                      {formatDate(currentSubscription.current_period_end)}, then
                      will be canceled.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="btn-secondary flex-1"
                      >
                        Keep Subscription
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-error text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Confirm Cancel"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-card p-1 rounded-xl border border-border">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-colors",
                  billingCycle === "monthly"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-colors",
                  billingCycle === "yearly"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-white"
                )}
              >
                Yearly
                <span className="ml-2 text-xs text-amber-400">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isCurrentPlan = currentSubscription?.tier === plan.tier;
              const price =
                billingCycle === "monthly"
                  ? plan.price_monthly
                  : plan.price_yearly;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl p-6",
                    plan.popular
                      ? "bg-gradient-to-b from-primary/20 to-card border-2 border-primary"
                      : "bg-card border border-border",
                    isCurrentPlan && "ring-2 ring-amber-400"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-amber-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted text-sm mb-4">
                    {billingCycle === "yearly" && (
                      <>
                        <span className="line-through text-muted">
                          ${plan.price_monthly * 12}
                        </span>{" "}
                      </>
                    )}
                    ${price}/{billingCycle === "monthly" ? "month" : "year"}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-3 bg-muted text-muted-foreground rounded-xl font-semibold cursor-default"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessing}
                      className={cn(
                        "w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2",
                        plan.popular
                          ? "btn-primary"
                          : "bg-card-hover hover:bg-card border border-border"
                      )}
                    >
                      {isProcessing && selectedPlan === plan.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Payment Info */}
          {currentSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <p className="text-muted">
                Manage your payment methods in your{" "}
                <Link href="/settings/billing" className="text-primary hover:underline">
                  billing settings
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
