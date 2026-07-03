type FilYedeiProps = {
  className?: string;
};

export default function FilYedei({ className = "" }: FilYedeiProps) {
  return (
    <span className={`fil-yedei ${className}`} aria-hidden="true">
      <span className="fil-vert" />
      <span className="fil-rouge" />
      <span className="fil-bleu" />
    </span>
  );
}
