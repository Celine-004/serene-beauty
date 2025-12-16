import { Request, Response } from 'express'
import routineData from '../data/routines.json'

export const getRoutinesBySkinType = async (req: Request, res: Response) => {
  try {
    const { skinType } = req.params

    const validSkinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal']
    if (!validSkinTypes.includes(skinType)) {
      return res.status(400).json({ message: 'Invalid skin type' })
    }

    const routines = routineData.routines.filter(
      (routine) => routine.skinType === skinType
    )

    res.json({
      skinType,
      routines,
      totalRoutines: routines.length
    })
  } catch (error) {
    console.error('Error fetching routines:', error)
    res.status(500).json({ message: 'Server error fetching routines' })
  }
}

export const getAllRoutines = async (req: Request, res: Response) => {
  try {
    res.json({
      routines: routineData.routines,
      totalRoutines: routineData.routines.length
    })
  } catch (error) {
    console.error('Error fetching routines:', error)
    res.status(500).json({ message: 'Server error fetching routines' })
  }
}
