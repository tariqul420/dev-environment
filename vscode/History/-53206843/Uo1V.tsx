"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Facebook,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-accent-main hover:bg-accent-hover flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
            {open ? (
              <X className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <Send className="h-5 w-5 transition-transform duration-200" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 rounded-xl p-4 shadow-2xl">
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold">
              👋 কিভাবে সাহায্য করতে পারি?
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="tel:+8809647001177"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition"
            >
              <Phone className="h-5 w-5" />
              <span>কল করুন</span>
            </a>

            <a
              href="mailto:support@naturalsefa.com"
              className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition"
            >
              <Mail className="h-5 w-5" />
              <span>ইমেইল পাঠান</span>
            </a>

            <a
              href="https://chat.whatsapp.com/G62FiyRWJnN8zSvNhfmMhY"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp করুন</span>
            </a>

            <a
              href="https://m.me/naturalsefabd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition"
            >
              <Facebook className="h-5 w-5" />
              <span>Messenger</span>
            </a>

            <a
              href="/contact-us"
              className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Contact Us Page</span>
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
