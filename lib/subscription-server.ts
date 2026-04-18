"use server";

import { auth } from "@clerk/nextjs/server";
import { PLAN_SLUGS, PLANS, PlanLimits, PlanType } from "./subscription-constants";

// ============================================
// SERVER-SIDE SUBSCRIPTION UTILITIES
// Uses Clerk's auth().has() to check the user's active plan
// ============================================

/**
 * Resolves the current user's plan type using Clerk's has() method.
 * Falls back to "free" if the user has no active subscription.
 */
export const getUserPlan = async (): Promise<PlanType> => {
  const { has } = await auth();

  if (has({ plan: PLAN_SLUGS.PRO })) return PLAN_SLUGS.PRO;
  if (has({ plan: PLAN_SLUGS.STANDARD })) return PLAN_SLUGS.STANDARD;

  return PLAN_SLUGS.FREE;
};

/**
 * Returns the plan limits for the current user.
 */
export const getUserPlanLimits = async (): Promise<PlanLimits> => {
  const plan = await getUserPlan();
  return PLANS[plan];
};

/**
 * Returns both the plan type and its limits for the current user.
 */
export const getUserPlanInfo = async (): Promise<{
  plan: PlanType;
  limits: PlanLimits;
}> => {
  const plan = await getUserPlan();
  return { plan, limits: PLANS[plan] };
};
