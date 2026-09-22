import { Schema, model, Document } from 'mongoose';

// ============================================
// Dominio: Coworking Space
// ============================================
// createdBy guarda el ID del usuario que creó el espacio. Permite que el
// dueño edite SU recurso (pero solo admin puede eliminarlo — enforced en
// space.routes.ts con requireRole('admin')).

export interface ISpace extends Document {
  name: string;
  code: string;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

const spaceSchema = new Schema<ISpace>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
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
    createdBy: { type: String, required: true }, // user ID
  },
  { timestamps: true }
);

export const Space = model<ISpace>('Space', spaceSchema);
