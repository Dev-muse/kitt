"use client";

import { useAuth } from "@clerk/nextjs";
import {
  PLAN_SLUGS,
  PLANS,
  PlanLimits,
  PlanType,
} from "@/lib/subscription-constants";

/**
 * Client-side hook that resolves the current user's subscription plan
 * using Clerk's has() helper, and returns the plan type + limits.
 */
export const useSubscription = () => {
  const { has, isLoaded } = useAuth();

  if (!isLoaded) {
    return {
      plan: PLAN_SLUGS.FREE as PlanType,
      limits: PLANS[PLAN_SLUGS.FREE] as PlanLimits,
      isLoaded: false,
    };
  }

  let plan: PlanType = PLAN_SLUGS.FREE;

  if (has?.({ plan: PLAN_SLUGS.PRO })) {
    plan = PLAN_SLUGS.PRO;
  } else if (has?.({ plan: PLAN_SLUGS.STANDARD })) {
    plan = PLAN_SLUGS.STANDARD;
  }

  return {
    plan,
    limits: PLANS[plan],
    isLoaded: true,
  };
};