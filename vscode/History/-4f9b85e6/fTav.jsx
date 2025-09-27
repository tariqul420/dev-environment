"use client"

import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const formRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
      .sendForm('service_1ln71ai', 'template_0bt8os92', formRef.current, {
        publicKey: 'rEEWJVuNRCGFl9Zbs',
      })
      .then(
        () => {
          toast.success('Message sent successfully! 🎉');
          setSubmitStatus('success');
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          formRef.current.reset();
        },
        (error) => {
          console.error('FAILED...', error.text);
          toast.error('Failed to send message. Please try again.');
          setSubmitStatus('error');
        },
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Send Message</h2>
                <p className="text-gray-300">Fill out the form below and I'll get back to you within 24 hours.</p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                    <option value="" className="bg-gray-800">
                      Select a subject
                    </option>
                    <option value="web-development" className="bg-gray-800">
                      Web Development Project
                    </option>
                    <option value="consultation" className="bg-gray-800">
                      Consultation
                    </option>
                    <option value="collaboration" className="bg-gray-800">
                      Collaboration
                    </option>
                    <option value="other" className="bg-gray-800">
                      Other
                    </option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell me about your project, timeline, and any specific requirements..."></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span>✅</span>
                      <span>Message sent successfully! I'll get back to you soon.</span>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span>❌</span>
                      <span>Something went wrong. Please try again or contact me directly.</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
  )
}
