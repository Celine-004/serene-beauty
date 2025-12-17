import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  productId: string
  name: string
  brand: string
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment'
  suitableFor: ('oily' | 'dry' | 'combination' | 'sensitive' | 'normal')[]
  targetConcerns: ('acne' | 'dryness' | 'oiliness' | 'sensitivity' | 'redness' | 'uneven_texture' | 'dullness' | 'large_pores' | 'fine_lines' | 'dark_spots')[]
  description: string
  dayTime: ('AM' | 'PM')[]
  keyIngredients: string[]
  allIngredients: string
  priceRange: 'budget' | 'mid-range' | 'premium'
  url: string
  imageURL: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    productId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment']
    },
    suitableFor: {
      type: [String],
      required: true,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal']
    },
    targetConcerns: {
      type: [String],
      default: [],
      enum: ['acne', 'dryness', 'oiliness', 'sensitivity', 'redness', 'uneven_texture', 'dullness', 'large_pores', 'fine_lines', 'dark_spots']
    },
    description: {
      type: String,
      required: true
    },
    dayTime: {
      type: [String],
      required: true,
      enum: ['AM', 'PM', 'Daily']
    },
    keyIngredients: {
      type: [String],
      default: []
    },
    allIngredients: {
      type: String,
      default: ''
    },
    priceRange: {
      type: String,
      required: true,
      enum: ['budget', 'mid-range', 'premium']
    },
    url: {
      type: String,
      default: ''
    },
    imageURL: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IProduct>('Product', productSchema)
