"use client";

interface ChillinLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
  showIcon?: boolean;
}

export default function ChillinLogo({
  size = "md",
  variant = "light",
  className = "",
  showIcon = true,
}: ChillinLogoProps) {
  const config = {
    sm: { text: "text-sm", icon: 16, gap: "gap-1" },
    md: { text: "text-2xl", icon: 22, gap: "gap-1.5" },
    lg: { text: "text-5xl", icon: 44, gap: "gap-3" },
  };

  const s = config[size];
  const textColor = variant === "dark" ? "text-paper" : "text-ink";

  return (
    <span
      className={`logo-mark group inline-flex items-center ${s.gap} ${className}`}
      style={{ transform: "rotate(-2deg)" }}
      aria-label="chillin"
      role="img"
    >
      {showIcon && (
        <svg
          viewBox="0 0 24 24"
          width={s.icon}
          height={s.icon}
          className="logo-icon text-sage flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          aria-hidden="true"
        >
          {/* Face outline */}
          <circle cx="12" cy="12" r="10" />
          {/* Left happy-closed eye */}
          <path d="M 7 10.5 Q 8.5 8 10 10.5" />
          {/* Right happy-closed eye */}
          <path d="M 14 10.5 Q 15.5 8 17 10.5" />
          {/* Content smile */}
          <path d="M 8 14.5 Q 12 17.5 16 14.5" />
        </svg>
      )}
      <span
        className={`font-serif font-bold italic tracking-tight ${s.text}`}
        aria-hidden="true"
      >
        <span className={textColor}>chill</span>
        <span className="text-sage">in</span>
      </span>
    </span>
  );
}
