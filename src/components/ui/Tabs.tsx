import { useId, useState, type ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export default function Tabs({ tabs, defaultTab, className }: Props) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  if (!tabs.length) return null;

  return (
    <div className={['hsg-tabs', className].filter(Boolean).join(' ')}>
      <div role="tablist" className="hsg-tabs__list">
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              id={`${baseId}-tab-${t.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={`hsg-tabs__trigger ${selected ? 'is-active' : ''}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${baseId}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={t.id !== active}
          className="hsg-tabs__panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
