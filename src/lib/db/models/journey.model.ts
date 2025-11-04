import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Type Hierarchy for Journey Data:
 *
 * JourneyData (base) → Journey (backend) → JourneyObject (toObject result) → JourneyClient (API)
 *                    → CreateJourneyInput (creation)
 *                    → UpdateJourneyInput (updates)
 */

// Base journey data interface (shared between backend and client)
export interface JourneyData {
  userId: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFileName: string;
  resumeText: string;
  insights?: string | null;
  coverLetter?: string | null;
  status: 'draft' | 'in-progress' | 'completed' | 'applied' | 'archived';
}

// Backend types (with MongoDB-specific fields)
export interface Journey extends JourneyData, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Type for journey.toObject() result
export interface JourneyObject extends JourneyData {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Client-side type (derived from JourneyData with client-friendly types)
export interface JourneyClient extends JourneyData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const JourneySchema = new Schema<Journey>(
  {
    userId: { type: String, required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    resumeFileName: { type: String, required: true },
    resumeText: { type: String, required: true },
    insights: { type: String, default: null },
    coverLetter: { type: String, default: null },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'completed', 'applied', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export const JourneyModel: Model<Journey> =
  mongoose.models.Journey || mongoose.model<Journey>('Journey', JourneySchema);
