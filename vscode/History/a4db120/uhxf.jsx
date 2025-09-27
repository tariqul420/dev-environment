import { Facebook, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import ContactCard from "../contact-card";
import ContactForm from "../contact-form";
import SocialLinkButton from "../social-link-button";

const contacts = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    value: "jishanulhaque24@gmail.com",
    href: "mailto:jishanulhaque24@gmail.com",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    value: "01790-988348",
    href: "tel:+8801790988348",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Location",
    value: "Chapai Nawabganj, Rajshahi",
    href: "https://maps.google.com/?q=Chapai+Nawabganj,+Rajshahi",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <Linkedin className="h-6 w-6" />,
    title: "LinkedIn",
    value: "/in/md-mosiur-rahman73",
    href: "https://www.linkedin.com/in/md-mosiur-rahman73/",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const socials = [
  {
    label: "GitHub",
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/mosiur73/",
  },
  {
    label: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://www.linkedin.com/in/md-mosiur-rahman73/",
  },
  {
    label: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    href: "https://web.facebook.com/mdmosiur.rahman.9484941",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 py-20">
      <div className="mb-14 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          Let&apos;s Connect
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base md:text-lg">
          Ready to bring your ideas to life? Tell me a bit about your project
          and I&apos;ll get back soon.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center justify-center gap-10 lg:grid-cols-2">
        {/* Left: Cards + Social */}
        <div className="space-y-8">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contacts.map((c, i) => (
              <ContactCard
                key={i}
                icon={c.icon}
                title={c.title}
                value={c.value}
                href={c.href}
                gradient={c.gradient}
              />
            ))}
          </div>

          {/* Social Links */}
          <div className="rounded-2xl border bg-white/5 p-6 backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold">Connect on Social</h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((s, i) => (
                <SocialLinkButton
                  key={i}
                  href={s.href}
                  icon={s.icon}
                  label={s.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <ContactForm />
      </div>
    </section>
  );
}
