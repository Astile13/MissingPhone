import { Schema, model, models, type Model } from "mongoose";

export interface ScoreDoc {
  name: string;
  time?: number; // seconds, set on finish
  createdAt: Date;
}

const ScoreSchema = new Schema<ScoreDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    time: { type: Number, min: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
ScoreSchema.index({ time: 1 });

export default (models.Score as Model<ScoreDoc>) || model<ScoreDoc>("Score", ScoreSchema);