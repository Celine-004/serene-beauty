import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  brand: string
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment'
  suitableFor: ('oily' | 'dry' | 'combination' | 'sensitive' | 'normal')[]
  targetConcerns: ('acne' | 'dryness' | 'oiliness' | 'sensitivity' | 'redness' | 'uneven_texture' | 'dullness' | 'large_pores' | 'fine_lines' | 'dark_spots')[]
  priceRange: 'budget' | 'mid-range' | 'premium'
  description: string
  keyIngredients: string[]
  url: string
  allIngredients: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment']
    },
    suitableFor: {
      type: [String],
      required: true,
      enum:['oily', 'dry', 'combination', 'sensitive', 'normal']
    },
    targetConcerns: {
      type: [String],
      default: [],
      enum:['acne', 'dryness', 'oiliness', 'sensitivity', 'redness', 'uneven_texture', 'dullness', 'large_pores', 'fine_lines', 'dark_spots']
    },
    priceRange: {
      type: String,
      required: true,
      enum: ['budget', 'mid-range', 'premium']
    },
    description: {
      type: String,
      required: true
    },
    keyIngredients: {
      type: [String],
      default: []
    },
    url: {
      type: String,
      default: ''
    },
    allIngredients: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IProduct>('Product', productSchema)
