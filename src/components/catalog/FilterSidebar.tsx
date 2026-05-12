import { useEffect, useState } from 'react';

export interface FilterFacets {
  brands: { id: string; name: string }[];
  priceRanges: { value: string; label: string }[];
  setupTypes: string[];
  indoorOutdoor: string[];
  badges: string[];
}

interface Props {
  facets: FilterFacets;
}

interface ActiveFilters {
  brand: string[];
  price: string[];
  setup: string[];
  placement: string[];
  badge: string[];
  pick: boolean;
  score: number;
}

const EMPTY: ActiveFilters = {
  brand: [],
  price: [],
  setup: [],
  placement: [],
  badge: [],
  pick: false,
  score: 0,
};

function readFromUrl(): ActiveFilters {
  if (typeof window === 'undefined') return EMPTY;
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => (p.get(k) ? p.get(k)!.split(',').filter(Boolean) : []);
  return {
    brand: get('brand'),
    price: get('price'),
    setup: get('setup'),
    placement: get('placement'),
    badge: get('badge'),
    pick: p.get('pick') === '1',
    score: Number(p.get('score') || 0),
  };
}

function writeToUrl(state: ActiveFilters) {
  const p = new URLSearchParams(window.location.search);
  const setOrDelete = (k: string, arr: string[]) => {
    if (arr.length) p.set(k, arr.join(','));
    else p.delete(k);
  };
  setOrDelete('brand', state.brand);
  setOrDelete('price', state.price);
  setOrDelete('setup', state.setup);
  setOrDelete('placement', state.placement);
  setOrDelete('badge', state.badge);
  if (state.pick) p.set('pick', '1'); else p.delete('pick');
  if (state.score > 0) p.set('score', String(state.score)); else p.delete('score');
  const qs = p.toString();
  window.history.replaceState({}, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  window.dispatchEvent(new CustomEvent('hsg:filter:change'));
}

export default function FilterSidebar({ facets }: Props) {
  const [state, setState] = useState<ActiveFilters>(EMPTY);
  const [open, setOpen] = useState(false);

  useEffect(() => { setState(readFromUrl()); }, []);
  useEffect(() => { if (typeof window !== 'undefined') writeToUrl(state); }, [state]);

  const toggle = (key: keyof ActiveFilters, value: string) => {
    setState((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  };

  const activeCount =
    state.brand.length + state.price.length + state.setup.length +
    state.placement.length + state.badge.length + (state.pick ? 1 : 0) + (state.score > 0 ? 1 : 0);

  const clearAll = () => setState(EMPTY);

  const body = (
    <div className="hsg-filter__body">
      <div className="hsg-filter__head">
        <h2>Filter</h2>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="hsg-filter__clear">
            Clear ({activeCount})
          </button>
        )}
      </div>

      {facets.brands.length > 0 && (
        <fieldset>
          <legend>Brand</legend>
          {facets.brands.map((b) => (
            <label key={b.id}>
              <input
                type="checkbox"
                checked={state.brand.includes(b.id)}
                onChange={() => toggle('brand', b.id)}
              /> {b.name}
            </label>
          ))}
        </fieldset>
      )}

      {facets.priceRanges.length > 0 && (
        <fieldset>
          <legend>Price</legend>
          {facets.priceRanges.map((r) => (
            <label key={r.value}>
              <input
                type="checkbox"
                checked={state.price.includes(r.value)}
                onChange={() => toggle('price', r.value)}
              /> {r.label}
            </label>
          ))}
        </fieldset>
      )}

      {facets.setupTypes.length > 0 && (
        <fieldset>
          <legend>Setup type</legend>
          {facets.setupTypes.map((s) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={state.setup.includes(s)}
                onChange={() => toggle('setup', s)}
              /> <span style={{ textTransform: 'capitalize' }}>{s.replace('-', ' ')}</span>
            </label>
          ))}
        </fieldset>
      )}

      {facets.indoorOutdoor.length > 0 && (
        <fieldset>
          <legend>Placement</legend>
          {facets.indoorOutdoor.map((s) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={state.placement.includes(s)}
                onChange={() => toggle('placement', s)}
              /> <span style={{ textTransform: 'capitalize' }}>{s}</span>
            </label>
          ))}
        </fieldset>
      )}

      {facets.badges.length > 0 && (
        <fieldset>
          <legend>Badges</legend>
          {facets.badges.map((b) => (
            <label key={b}>
              <input
                type="checkbox"
                checked={state.badge.includes(b)}
                onChange={() => toggle('badge', b)}
              /> {b}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend>Min editor score</legend>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={state.score}
          onChange={(e) => setState((prev) => ({ ...prev, score: Number(e.target.value) }))}
        />
        <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
          {state.score.toFixed(1)}+
        </span>
      </fieldset>

      <fieldset>
        <label>
          <input
            type="checkbox"
            checked={state.pick}
            onChange={(e) => setState((p) => ({ ...p, pick: e.target.checked }))}
          /> Editor's picks only
        </label>
      </fieldset>
    </div>
  );

  return (
    <>
      <button type="button" className="hsg-filter__mobile-toggle" onClick={() => setOpen(true)}>
        Filter{activeCount > 0 ? ` · ${activeCount}` : ''}
      </button>
      <aside className="hsg-filter" aria-label="Product filters">{body}</aside>
      {open && (
        <div className="hsg-filter__drawer" role="dialog" aria-modal="true">
          <div className="hsg-filter__drawer-inner">
            {body}
            <button type="button" onClick={() => setOpen(false)} className="hsg-filter__drawer-close">Done</button>
          </div>
        </div>
      )}
    </>
  );
}
