// ============================================
// MODELO: SpaceCategory — entidad secundaria (sin referencias)
// Agrupa los espacios por tipo (sala de reunión, oficina privada, etc.)
// ============================================

import { Schema, model } from 'mongoose';

export interface ISpaceCategory {
  name: string;
  description?: string;
}

const spaceCategorySchema = new Schema<ISpaceCategory>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 100,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// 'SpaceCategory' (singular, PascalCase) → colección 'spacecategories'
export const SpaceCategory = model<ISpaceCategory>('SpaceCategory', spaceCategorySchema);
