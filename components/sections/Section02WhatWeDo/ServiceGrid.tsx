import ServiceCard from "./ServiceCard";
import { SERVICES } from "./serviceData";

export default function ServiceGrid() {
  return (
    <ul
      role="list"
      // Section 57: Continuous matrix, borders do the separating
      className="service-grid grid grid-cols-1 border-l border-t border-[var(--ironhaul-border)] md:grid-cols-3 min-[1200px]:grid-cols-6"
    >
      {SERVICES.map((service, i) => (
        <ServiceCard key={service.id} service={service} index={i} />
      ))}
    </ul>
  );
}