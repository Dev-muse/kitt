import { IVoiceSession } from "@/types";
import { model, models, Schema } from "mongoose";

// used IVoiceSession to sync the application types with database models
const VoiceSessionSchema = new Schema<IVoiceSession>(
  {
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, required: true, default: 0 },
    billingPeriodStart: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
  },
);


VoiceSessionSchema.index({ clerkId: 1, billingPeriodStart: 1 });




// used models.VoiceSession to avoid redefining the model if it already exists
const VoiceSession =
  models.VoiceSession ||
  model<IVoiceSession>("VoiceSession", VoiceSessionSchema);

export default VoiceSession;
