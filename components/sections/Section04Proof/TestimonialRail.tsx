import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./proofData";

export default function TestimonialRail() {
  return (
    <div data-s4="rail" className="grid gap-4 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <TestimonialCard key={t.id} t={t} index={i} />
      ))}
    </div>
  );
}