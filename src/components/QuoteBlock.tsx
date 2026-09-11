import "./QuoteBlock.css";

interface QuoteBlockProps {
  quote: string;
  attribution?: string;
}

export default function QuoteBlock({ quote, attribution }: QuoteBlockProps) {
  return (
    <blockquote className="quote-block">
      <p>&ldquo;{quote}&rdquo;</p>
      {attribution && <cite>{attribution}</cite>}
    </blockquote>
  );
}
