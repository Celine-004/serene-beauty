import mongoose, { Schema, Document } from 'mongoose'

export interface IRoutineStep {
  order: number
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment'
}

export interface IRoutine extends Document {
  routineId: string
  name: string
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'
  timeOfDay: 'AM' | 'PM' | 'Daily'
  description: string
  steps: IRoutineStep[]
  createdAt: Date
  updatedAt: Date
}

const routineStepSchema = new Schema<IRoutineStep>(
  {
    order: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment']
    }
  },
  { _id: false }
)

const routineSchema = new Schema<IRoutine>(
  {
    routineId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    skinType: {
      type: String,
      required: true,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal']
    },
    timeOfDay: {
      type: String,
      required: true,
      enum: ['AM', 'PM', 'Daily']
    },
    description: {
      type: String,
      required: true
    },
    steps: {
      type: [routineStepSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IRoutine>('Routine', routineSchema)
