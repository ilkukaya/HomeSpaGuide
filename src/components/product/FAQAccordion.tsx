import Accordion from '../ui/Accordion';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: Props) {
  if (!faqs.length) return null;
  return (
    <Accordion
      multiple
      items={faqs.map((f) => ({
        title: f.question,
        content: <p style={{ lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>{f.answer}</p>,
      }))}
    />
  );
}
