// ============================================
// MODELO: Space — entidad principal (con referencia a SpaceCategory)
// Un espacio reservable dentro del coworking
// ============================================

import { Schema, model, Types } from 'mongoose';

export interface ISpace {
  name: string;
  code: string;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  category: Types.ObjectId;
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'SpaceCategory',
      required: [true, 'La categoría es requerida'],
    },
  },
  { timestamps: true },
);

export const Space = model<ISpace>('Space', spaceSchema);
