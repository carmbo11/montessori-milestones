// Affiliate Link Scoring System
// Ported from marketing-cms with modifications for Montessori Milestones

import type { AffiliateLink } from '../database.types';

export type ScoringStrategy =
  | 'highest_commission'
  | 'highest_effective_value'
  | 'prefer_direct'
  | 'manual';

/**
 * Calculate the effective value of an affiliate link
 * This considers commission rate, cookie duration, and estimated conversion rate
 *
 * Formula: effectiveValue = commissionRate × cookieFactor × conversionRate
 * Cookie factor uses log scaling to diminish returns for very long cookies
 */
export function calculateEffectiveValue(
  commissionRate: number,
  cookieDays: number,
  conversionRate: number = 0.03
): number {
  // Cookie factor: logarithmic scaling, normalized to 30-day baseline
  // log(cookieDays + 1) / log(31) gives ~1.0 for 30 days
  const cookieFactor = Math.log(cookieDays + 1) / Math.log(31);

  return commissionRate * cookieFactor * conversionRate;
}

/**
 * Calculate effective value for an affiliate link object
 */
export function getLinkEffectiveValue(link: AffiliateLink): number {
  return calculateEffectiveValue(
    link.commission_rate || 0,
    link.cookie_days || 30,
    link.estimated_conversion
  );
}

/**
 * Select the best affiliate link based on strategy
 *
 * Strategies:
 * - highest_commission: Simply pick the highest commission rate
 * - highest_effective_value: Consider commission, cookie length, and conversion
 * - prefer_direct: Prefer specific networks in priority order
 * - manual: Use the manually selected preferred link
 */
export function selectBestLink(
  links: AffiliateLink[],
  strategy: ScoringStrategy = 'highest_effective_value',
  networkPriority: string[] = ['impact', 'awin', 'amazon'],
  preferredLinkId?: string
): AffiliateLink | null {
  // Filter to active links only
  const activeLinks = links.filter(link => link.is_active);

  if (activeLinks.length === 0) {
    return null;
  }

  if (activeLinks.length === 1) {
    return activeLinks[0];
  }

  switch (strategy) {
    case 'manual':
      // Return the manually preferred link, or fall back to highest_effective_value
      if (preferredLinkId) {
        const preferred = activeLinks.find(l => l.id === preferredLinkId);
        if (preferred) return preferred;
      }
      // Fall through to default strategy
      return selectBestLink(activeLinks, 'highest_effective_value', networkPriority);

    case 'highest_commission':
      return activeLinks.reduce((best, current) =>
        (current.commission_rate || 0) > (best.commission_rate || 0) ? current : best
      );

    case 'prefer_direct':
      // Find the first matching network in priority order
      for (const network of networkPriority) {
        const match = activeLinks.find(l => l.network.toLowerCase() === network.toLowerCase());
        if (match) return match;
      }
      // Fall back to highest_effective_value if no priority match
      return selectBestLink(activeLinks, 'highest_effective_value', networkPriority);

    case 'highest_effective_value':
    default:
      return activeLinks.reduce((best, current) => {
        const currentValue = getLinkEffectiveValue(current);
        const bestValue = getLinkEffectiveValue(best);
        return currentValue > bestValue ? current : best;
      });
  }
}

/**
 * Rank all links by their effective value (descending)
 */
export function rankLinksByValue(links: AffiliateLink[]): Array<AffiliateLink & { effectiveValue: number }> {
  return links
    .filter(link => link.is_active)
    .map(link => ({
      ...link,
      effectiveValue: getLinkEffectiveValue(link)
    }))
    .sort((a, b) => b.effectiveValue - a.effectiveValue);
}

/**
 * Format effective value as percentage for display
 */
export function formatEffectiveValue(value: number): string {
  return (value * 100).toFixed(4) + '%';
}
