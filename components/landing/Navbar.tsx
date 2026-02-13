"use client";

import { useEffect, useState } from "react";
import ChillinLogo from "@/components/ui/ChillinLogo";
import { useWaitlistModal } from "./WaitlistProvider";

export default function Navbar() {
  const { openWaitlistModal } = useWaitlistModal();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 80);

      if (y - lastScroll > 8 && y > 200) {
        setHidden(true);
      } else if (lastScroll - y > 8) {
        setHidden(false);
      }

      setLastScroll(y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 ease-out
        ${
          scrolled
            ? "py-3 bg-cream/85 backdrop-blur-[20px] backdrop-saturate-[1.4] shadow-[0_1px_30px_rgba(0,0,0,0.06)]"
            : "py-5 bg-transparent"
        }
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 flex items-center justify-between">
        <a
          href="#"
          className="transition-colors duration-400"
        >
          <ChillinLogo />
        </a>

        <ul className="flex items-center gap-9 list-none">
          <li className="hidden md:block">
            <a
              href="#how"
              onClick={(e) => scrollToSection(e, "how")}
              className="text-sm font-medium text-ink/55 hover:text-ink relative transition-colors duration-300 hover:after:scale-x-100
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-sage after:scale-x-0 after:origin-left after:transition-transform after:duration-300"
            >
              How it works
            </a>
          </li>
          <li className="hidden md:block">
            <a
              href="#coverage"
              onClick={(e) => scrollToSection(e, "coverage")}
              className="text-sm font-medium text-ink/55 hover:text-ink relative transition-colors duration-300 hover:after:scale-x-100
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-sage after:scale-x-0 after:origin-left after:transition-transform after:duration-300"
            >
              What we handle
            </a>
          </li>
          <li className="hidden md:block">
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="text-sm font-medium text-ink/55 hover:text-ink relative transition-colors duration-300 hover:after:scale-x-100
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-sage after:scale-x-0 after:origin-left after:transition-transform after:duration-300"
            >
              Pricing
            </a>
          </li>
          <li>
            <button
              onClick={openWaitlistModal}
              className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold bg-ink text-paper transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(13,13,26,0.2)]"
            >
              Join the waitlist
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
