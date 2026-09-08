import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// MODELO DEL RECURSO PRINCIPAL — Space
// ============================================
// Dominio: Coworking Space. Un espacio reservable dentro del coworking,
// con referencia al usuario autenticado que lo registró (createdBy).
// ============================================

export interface ISpace extends Document {
  name: string;
  code: string;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const spaceSchema = new Schema<ISpace>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 150,
    },
    code: {
      type: String,
      required: [true, 'El código es requerido'],
      trim: true,
      unique: true,
      uppercase: true,
      match: [/^SP-\d{3,}$/, 'code debe tener el formato SP-001'],
    },
    capacity: {
      type: Number,
      required: [true, 'La capacidad es requerida'],
      min: [1, 'capacity debe ser al menos 1'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'El precio por hora es requerido'],
      min: [0, 'pricePerHour no puede ser negativo'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const SpaceModel = mongoose.model<ISpace>('Space', spaceSchema);
