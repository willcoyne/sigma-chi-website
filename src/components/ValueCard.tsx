import "./ValueCard.css";

interface ValueCardProps {
  title: string;
  body: string;
  index: number;
}

export default function ValueCard({ title, body, index }: ValueCardProps) {
  return (
    <div className="value-card">
      <span className="value-card__index">{String(index).padStart(2, "0")}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
