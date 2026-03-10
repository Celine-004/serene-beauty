import mongoose, { Schema, Document } from 'mongoose'

export interface IProductUsageLog extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  amRoutine: {
    completed: boolean
    completedAt?: Date
    productsUsed: {
      productId: string
      category: string
      name: string
      stepOrder: number
    }[]
  }
  pmRoutine: {
    completed: boolean
    completedAt?: Date
    productsUsed: {
      productId: string
      category: string
      name: string
      stepOrder: number
    }[]
  }
  customProducts: {
    productId: string
    name: string
    dayTime: 'AM' | 'PM'
    addedAt: Date
  }[]
  skinRating?: number
  skinFeeling?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const productUsageLogSchema = new Schema<IProductUsageLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    amRoutine: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      productsUsed: [{
        productId: { type: String, required: true },
        category: { type: String, required: true },
        name: { type: String, required: true },
        stepOrder: { type: Number, required: true }
      }]
    },
    pmRoutine: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      productsUsed: [{
        productId: { type: String, required: true },
        category: { type: String, required: true },
        name: { type: String, required: true },
        stepOrder: { type: Number, required: true }
      }]
    },
    customProducts: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      dayTime: { type: String, enum: ['AM', 'PM'], required: true },
      addedAt: { type: Date, default: Date.now }
    }],
    skinRating: {
      type: Number,
      min: 1,
      max: 10
    },
    skinFeeling: [{
      type: String,
      enum: ['oily', 'dry', 'tight', 'smooth', 'rough', 'irritated', 'balanced', 'glowy', 'dull', 'sensitive']
    }],
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
)

// One log per user per day
productUsageLogSchema.index({ userId: 1, date: 1 }, { unique: true })

export default mongoose.model<IProductUsageLog>('ProductUsageLog', productUsageLogSchema)
