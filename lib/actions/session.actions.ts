"use server";

import VoiceSession from "@/database/models/voice-sessions.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurrentBillPeriodStart } from "../subscription-constants";
import { auth } from "@clerk/nextjs/server";
import { getUserPlanInfo } from "../subscription-server";

export const startVoiceSession = async (
  clerkId: string,
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();

    // Verify the caller is authenticated and matches the provided clerkId
    const { userId } = await auth();
    if (!userId || userId !== clerkId) {
      return { success: false, error: "Unauthorized: User not authenticated" };
    }

    // Check subscription limits before starting a session
    const { plan, limits } = await getUserPlanInfo();
    const billingPeriodStart = getCurrentBillPeriodStart();

    // Count sessions in the current billing period (calendar month)
    if (limits.maxSessionsPerMonth !== null) {
      const sessionCount = await VoiceSession.countDocuments({
        clerkId,
        billingPeriodStart,
      });

      if (sessionCount >= limits.maxSessionsPerMonth) {
        return {
          success: false,
          error: `You have reached your ${plan} plan limit of ${limits.maxSessionsPerMonth} session${limits.maxSessionsPerMonth === 1 ? "" : "s"} per month. Please upgrade your plan to start more sessions.`,
          isBillingError: true,
        };
      }
    }

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart,
      durationInSeconds: 0,
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      maxDurationMinutes: limits.maxSessionDurationMinutes,
    };
  } catch (e) {
    console.error("Error starting voice session", e);

    return {
      success: false,
      error: "Failed to start voice session, please try again later",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const result = await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds,
    });
    if (!result) return { success: false, error: "Voice session not found!" };

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later",
    };
  }
};
