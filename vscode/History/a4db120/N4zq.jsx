'use client';

import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
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
            user_name: '',
            user_email: '',
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

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'jishanulhaque24@gmail.com',
      link: '',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '📱',
      title: 'Phone',
      value: '01790-988348',
      link: '',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'Chapai Nawabganj , Rajshahi',
      link: 'https://maps.google.com',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💼',
      title: 'LinkedIn',

      link: 'https://www.linkedin.com/in/md-mosiur-rahman73/',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <div id="contact" className="relative min-h-screen max-w-7xl">
      <div className="relative z-10 min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Send Message</h2>
                <p className="text-gray-300">Fill out the form below and I'll get back to you within 24 hours.</p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      value={formData.user_email}
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

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {info.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{info.value}</p>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Connect on Social</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      name: 'GitHub',
                      icon: <FaGithub size={24} />,
                      link: 'https://github.com/mosiur73/',
                      color: 'hover:text-gray-300',
                    },
                    {
                      name: 'LinkedIn',
                      icon: <FaLinkedin size={24} />,
                      link: 'https://www.linkedin.com/in/md-mosiur-rahman73/',
                      color: 'hover:text-blue-400',
                    },
                    {
                      name: 'Facebook',
                      icon: <FaFacebook size={24} />,
                      link: 'https://web.facebook.com/mdmosiur.rahman.9484941',
                      color: 'hover:text-blue-500',
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 ${social.color} hover:bg-white/10 hover:scale-110 transition-all duration-300`}
                      title={social.name}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Let's Connect</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Ready to bring your ideas to life? I'd love to hear about your project and discuss how we can work together.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
