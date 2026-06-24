import { ChevronDown } from "lucide-react";

export function FAQAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question} className="faq-item" open={index === 0}>
          <summary><span>{item.question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
