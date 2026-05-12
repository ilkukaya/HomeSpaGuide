import { useEffect, useState } from 'react';
import { SORT_OPTIONS, type SortKey } from '../../lib/sort';

interface Props {
  defaultValue?: SortKey;
}

export default function SortDropdown({ defaultValue = 'featured' }: Props) {
  const [value, setValue] = useState<SortKey>(defaultValue);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = (params.get('sort') as SortKey | null) ?? defaultValue;
    setValue(v);
  }, [defaultValue]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as SortKey;
    setValue(next);
    const params = new URLSearchParams(window.location.search);
    if (next === 'featured') params.delete('sort');
    else params.set('sort', next);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState({}, '', url);
    window.dispatchEvent(new CustomEvent('hsg:sort:change', { detail: next }));
  };

  return (
    <label className="hsg-sort">
      <span className="hsg-sort__label">Sort:</span>
      <select value={value} onChange={onChange} className="hsg-sort__select">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
