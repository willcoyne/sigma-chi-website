import IndexRow from "./IndexRow";

interface ValueCardProps {
  title: string;
  body: string;
  index: number;
}

/**
 * One of the Three Great Aims, rendered as an editorial index row. Kept as its
 * own component because the aims are the only numbered list on the site whose
 * ordinal is derived from its position in the creed rather than the page.
 */
export default function ValueCard({ title, body, index }: ValueCardProps) {
  return (
    <IndexRow ordinal={String(index).padStart(2, "0")} title={title} index={index - 1}>
      <p>{body}</p>
    </IndexRow>
  );
}
