import mongoose, { Schema, Document } from 'mongoose'

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'
  concerns: string[]
  quizAnswers: {
    questionId: number
    selectedOption: string
  }[]
  selectedProducts: {
    category: string
    productId: string
    dayTime: 'AM' | 'PM' | 'Both'
  }[]
  createdAt: Date
  updatedAt: Date
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    skinType: {
      type: String,
      required: true,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal']
    },
    concerns: {
      type: [String],
      default: [],
      enum: ['acne', 'dryness', 'oiliness', 'sensitivity', 'redness', 'uneven_texture', 'dullness', 'large_pores', 'fine_lines', 'dark_spots']
    },
    quizAnswers: [{
      questionId: { type: Number, required: true },
      selectedOption: { type: String, required: true }
    }],
    selectedProducts: [{
      category: { type: String, required: true },
      productId: { type: String, required: true },
      dayTime: { type: String, enum: ['AM', 'PM', 'Both'], default: 'Both' }
    }]
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema)