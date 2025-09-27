'use client';

import { Mail, MapPin, PhoneCall } from 'lucide-react';
import { BadgeTitle } from '../badge-title';
import ContactForm from '../contact-form';
import AnimationContainer from '../global/animation-container';
import { IconDock } from '../icon-dock';
import MagicCardContainer from '../magic-card-container';

const ContactMe = () => {
  return (
    <section id="contact-me" className="pt-24">
      <AnimationContainer className="flex items-center justify-center" delay={0.2}>
        <BadgeTitle title="Contact Me" />
      </AnimationContainer>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
        {/* Contact Information Card */}
        <AnimationContainer delay={0.3}>
          <MagicCardContainer>
            <div className="p-6 sm:p-8 lg:p-10 rounded-xl flex flex-col justify-between h-full">
              {/* Header */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-sm sm:text-base mb-6">I’m excited to connect and discuss your next project. Reach out via email, phone, or the form, and I’ll get back to you promptly!</p>
              </div>

              {/* Contact Info List */}
              <ul className="space-y-4">
                <li className="flex items-center text-sm sm:text-base lg:text-lg font-medium gap-3 group p-2 rounded-md transition-colors">
                  <PhoneCall className="w-5 h-5" />
                  <span className="break-words">+8801743892058</span>
                </li>
                <li className="flex items-center text-sm sm:text-base lg:text-lg font-medium gap-3 group p-2 rounded-md transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="break-words">contact@tariqul.dev</span>
                </li>
                <li className="flex items-center text-sm sm:text-base lg:text-lg font-medium gap-3 group p-2 rounded-md transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="break-words">Pabna, Bangladesh</span>
                </li>
              </ul>

              {/* Social Media Links */}
              <div className="flex items-center justify-center">
                <IconDock />
              </div>
            </div>
          </MagicCardContainer>
        </AnimationContainer>

        {/* Contact Form */}
        <AnimationContainer delay={0.6} className="w-full">
          <ContactForm />
        </AnimationContainer>
      </div>
    </section>
  );
};

export default ContactMe;
