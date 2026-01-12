/**
 * FAQSection Component — Tech-Forward Minimalism
 * Design: Accordion with minimal styling
 * Interaction: Smooth expand/collapse animation
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  items: FAQItem[];
}

export default function FAQSection({
  id,
  title,
  subtitle,
  items,
}: FAQSectionProps) {
  return (
    <section id={id} className="bg-white py-20 lg:py-32 border-t border-border">
      <div className="container max-w-3xl">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border border-border rounded-md px-6 data-[state=open]:bg-card"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
