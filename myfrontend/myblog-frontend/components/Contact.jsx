"use client"

import { useState } from "react"
import { contactService } from "../src/services/contactService"

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await contactService.submitContact(formData)
      
      // Clear form on success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setSubmitted(true)
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Have a question or suggestion? We'd love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: "✉️", label: "Email", value: "hello@bloghub.com" },
            { icon: "📍", label: "Location", value: "San Francisco, CA" },
            { icon: "🕐", label: "Response Time", value: "24-48 hours" },
          ].map((contact, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800 text-center"
            >
              <div className="text-4xl mb-3">{contact.icon}</div>
              <h3 className="font-semibold text-slate-950 dark:text-white mb-1">{contact.label}</h3>
              <p className="text-gray-600 dark:text-gray-400">{contact.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-8 md:p-12">
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
              ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Subject of your message"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Or connect with us on social media</p>
          <div className="flex justify-center gap-6">
            {["Twitter", "LinkedIn", "GitHub", "Instagram"].map((social) => (
              <button
                key={social}
                className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-white hover:text-white transition-all flex items-center justify-center font-semibold"
              >
                {social[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage;