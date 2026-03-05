import { useState } from 'react'
import Navbar from '../Layout/Navbar'
import { api } from '../../api'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.submitContact({ name, email, subject, message })
      setSuccess(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-heading text-deep-twilight mb-4">Contact Us</h1>
        <p className="mb-8 opacity-80">
          Have a question, feedback, or suggestion? We'd love to hear from you.
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg">
            <h2 className="text-xl font-heading mb-2">Message Sent!</h2>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-deep-twilight hover:underline font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-alabaster p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-alabaster rounded-lg focus:outline-none focus:border-wisteria transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  loading
                    ? 'bg-deep-twilight/50 cursor-not-allowed'
                    : 'bg-deep-twilight hover:opacity-90'
                }`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
