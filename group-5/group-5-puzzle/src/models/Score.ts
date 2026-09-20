import { Schema, model, models, type Model } from "mongoose";

export interface ScoreDoc {
  name: string;
  email: string;          // identifies the player, never sent to clients
  time?: number;          // best time in seconds
  bestAt?: Date;          // when the best time was set
  lastFinishedAt?: Date;  // when the last attempt ended
  createdAt: Date;
}

const ScoreSchema = new Schema<ScoreDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    time: { type: Number, min: 1 },
    bestAt: { type: Date },
    lastFinishedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
ScoreSchema.index({ time: 1, bestAt: 1 });

export default (models.Score as Model<ScoreDoc>) || model<ScoreDoc>("Score", ScoreSchema);