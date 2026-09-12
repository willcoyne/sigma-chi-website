import { Link } from "react-router-dom";
import type { MouseEventHandler, ReactNode } from "react";
import "./CTAButton.css";

interface CTAButtonProps {
  to?: string;
  href?: string;
  variant?: "filled" | "outline" | "outline-dark";
  children?: ReactNode;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  /** Only meaningful for the <button> form; links cannot be disabled. */
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}

export default function CTAButton({
  to,
  href,
  variant = "filled",
  children,
  onClick,
  type = "button",
  disabled = false,
  busy = false,
  className: extraClassName = "",
}: CTAButtonProps) {
  const className = `cta-button cta-button--${variant}${extraClassName ? ` ${extraClassName}` : ""}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
    >
      {children}
    </button>
  );
}
