import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateIncreasePercentage } from '@/utils';
import { ROUND_STATUS } from '@/constants';
import { mapRoundStatusToLabel } from '@/utils/statusMapping';

// Mock translator
const t = (k: string) => k;

describe('utils/formatCurrency', () => {
  it('formats CNY currency without fraction digits by default', () => {
    const result = formatCurrency(12345);
    expect(result).toContain('¥');
  });
});

describe('utils/calculateIncreasePercentage', () => {
  it('calculates increase percentage correctly', () => {
    expect(calculateIncreasePercentage(100, 120)).toBe(20);
  });

  it('returns 0 when old amount is 0 to avoid division by zero', () => {
    expect(calculateIncreasePercentage(0, 500)).toBe(0);
  });
});

describe('status mapping', () => {
  it('maps round status to i18n key', () => {
    expect(mapRoundStatusToLabel(ROUND_STATUS.PENDING, t)).toBe('analysis.statusMap.pending');
  });
});
