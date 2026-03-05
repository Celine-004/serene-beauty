import { Request, Response } from 'express'
import Contact from '../models/Contact'

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' })
    }

    await Contact.create({ name, email, subject, message })

    res.status(201).json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
}
