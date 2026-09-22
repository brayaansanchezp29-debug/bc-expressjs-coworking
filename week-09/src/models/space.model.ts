import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// Dominio: Coworking Space
// ============================================================

export interface ISpace extends Document {
  name: string;
  code: string;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpaceSchema = new Schema<ISpace>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^SP-\d{3,}$/, 'code debe tener el formato SP-001'],
    },
    capacity: { type: Number, required: true, min: 1 },
    pricePerHour: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const SpaceModel = mongoose.model<ISpace>('Space', SpaceSchema);
