// ============================================
// SUBSCRIPTION PLAN CONSTANTS
// ============================================

export const PLAN_SLUGS = {
  FREE: "free",
  STANDARD: "standard",
  PRO: "pro",
} as const;

export type PlanType = (typeof PLAN_SLUGS)[keyof typeof PLAN_SLUGS];

export interface PlanLimits {
  maxBooks: number;
  maxSessionsPerMonth: number | null; // null = unlimited
  maxSessionDurationMinutes: number;
  hasSessionHistory: boolean;
}

export const PLANS: Record<PlanType, PlanLimits> = {
  [PLAN_SLUGS.FREE]: {
    maxBooks: 1,
    maxSessionsPerMonth: 5,
    maxSessionDurationMinutes: 5,
    hasSessionHistory: false,
  },
  [PLAN_SLUGS.STANDARD]: {
    maxBooks: 10,
    maxSessionsPerMonth: 100,
    maxSessionDurationMinutes: 15,
    hasSessionHistory: true,
  },
  [PLAN_SLUGS.PRO]: {
    maxBooks: 100,
    maxSessionsPerMonth: null, // unlimited
    maxSessionDurationMinutes: 60,
    hasSessionHistory: true,
  },
};

/**
 * Returns the start of the current calendar month (billing period).
 */
export const getCurrentBillPeriodStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};
