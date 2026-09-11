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
}

export default function CTAButton({ to, href, variant = "filled", children, onClick, type = "button" }: CTAButtonProps) {
  const className = `cta-button cta-button--${variant}`;

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
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
