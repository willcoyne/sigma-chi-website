interface SectionDividerProps {
  count?: number;
  tone?: "navy" | "cream";
  flip?: boolean;
  className?: string;
}

/**
 * A row of pointed (Gothic/ogive) arches, evoking the Collegiate Gothic
 * arcades of WashU's Danforth Campus. Used as a silhouette divider between
 * sections. Purely decorative — hidden from assistive tech.
 */
export default function SectionDivider({ count = 6, tone = "navy", flip = false, className = "" }: SectionDividerProps) {
  const archWidth = 100 / count;
  const height = 48;
  const fill = tone === "navy" ? "var(--navy)" : "var(--cream)";

  const arches = Array.from({ length: count }, (_, i) => {
    const x = i * archWidth;
    const w = archWidth;
    return `M${x},${height} L${x},${height * 0.42} A${w / 2},${height * 0.62} 0 0 1 ${x + w / 2},0 A${w / 2},${height * 0.62} 0 0 1 ${x + w},${height * 0.42} L${x + w},${height} Z`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={{
        width: "100%",
        height: `${height}px`,
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <path d={arches} fill={fill} />
    </svg>
  );
}
