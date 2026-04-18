"use client";

import { useAuth } from "@clerk/nextjs";
import { PLAN_SLUGS, PLANS, PlanLimits, PlanType } from "./subscription-constants";

// ============================================
// CLIENT-SIDE SUBSCRIPTION UTILITIES
// Uses Clerk's useAuth().has() to check the user's active plan
// ============================================

/**
 * Hook that returns the current user's plan type.
 * Falls back to "free" if the user has no active subscription.
 */
export const useUserPlan = (): PlanType => {
  const { has } = useAuth();

  if (has?.({ plan: PLAN_SLUGS.PRO })) return PLAN_SLUGS.PRO;
  if (has?.({ plan: PLAN_SLUGS.STANDARD })) return PLAN_SLUGS.STANDARD;

  return PLAN_SLUGS.FREE;
};

/**
 * Hook that returns the current user's plan limits.
 */
export const useUserPlanLimits = (): PlanLimits => {
  const plan = useUserPlan();
  return PLANS[plan];
};

/**
 * Hook that returns both the plan type and its limits.
 */
export const useUserPlanInfo = (): { plan: PlanType; limits: PlanLimits } => {
  const plan = useUserPlan();
  return { plan, limits: PLANS[plan] };
};
