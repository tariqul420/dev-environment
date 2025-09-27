'use client';

import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import ContactForm from '../contact-form';

export default function ContactSection() {
  

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
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Let's Connect</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Ready to bring your ideas to life? I'd love to hear about your project and discuss how we can work together.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
