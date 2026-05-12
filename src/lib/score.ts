export interface EditorScoreInput {
  quality: number;
  value: number;
  setup: number;
  durability: number;
  energyEfficiency?: number;
}

const WEIGHTS = {
  quality: 0.3,
  value: 0.25,
  setup: 0.15,
  durability: 0.2,
  energyEfficiency: 0.1,
};

/**
 * Computes a weighted overall editor score from breakdown scores.
 * Energy efficiency is optional — when missing, weight redistributes.
 */
export function computeOverall(input: EditorScoreInput): number {
  const hasEnergy = typeof input.energyEfficiency === 'number';
  const weights = hasEnergy
    ? WEIGHTS
    : {
        quality: WEIGHTS.quality / 0.9,
        value: WEIGHTS.value / 0.9,
        setup: WEIGHTS.setup / 0.9,
        durability: WEIGHTS.durability / 0.9,
        energyEfficiency: 0,
      };
  const sum =
    input.quality * weights.quality +
    input.value * weights.value +
    input.setup * weights.setup +
    input.durability * weights.durability +
    (input.energyEfficiency ?? 0) * weights.energyEfficiency;
  return Math.round(sum * 10) / 10;
}

export function scoreTone(score: number): 'great' | 'good' | 'ok' | 'low' {
  if (score >= 9) return 'great';
  if (score >= 7.5) return 'good';
  if (score >= 6) return 'ok';
  return 'low';
}
