import type { ReactNode } from "react";
import "./StatusBadge.css";

export default function StatusBadge({ children }: { children?: ReactNode }) {
  return (
    <span className="status-badge">
      <span className="status-badge__dot" />
      {children}
    </span>
  );
}
