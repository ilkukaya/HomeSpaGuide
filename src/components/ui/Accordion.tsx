import { useState, useId, type ReactNode } from 'react';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface Props {
  items: AccordionItem[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  className?: string;
}

export default function Accordion({ items, multiple = false, className }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  const toggle = (idx: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className={['hsg-accordion', className].filter(Boolean).join(' ')}>
      {items.map((item, idx) => {
        const expanded = open.has(idx);
        const panelId = `${baseId}-panel-${idx}`;
        const btnId = `${baseId}-btn-${idx}`;
        return (
          <div key={idx} className="hsg-accordion__item">
            <h3>
              <button
                type="button"
                id={btnId}
                aria-controls={panelId}
                aria-expanded={expanded}
                onClick={() => toggle(idx)}
                className="hsg-accordion__trigger"
              >
                <span>{item.title}</span>
                <span aria-hidden="true" className={`hsg-accordion__chev ${expanded ? 'is-open' : ''}`}>›</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!expanded}
              className="hsg-accordion__panel"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
