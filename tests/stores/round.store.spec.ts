import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('@/utils/storage', () => ({
  STORAGE_KEYS: { INTERVIEW_ROUNDS: 'rounds' },
  storageManager: {
    get: async () => [],
    set: async () => true
  }
}));

// @ts-ignore
import { useRoundStore } from '@/stores/round';
import { ROUND_STATUS } from '@/constants';

const makeRound = (over: Partial<any> = {}) => ({
  processId: over.processId || 'p1',
  companyId: over.companyId || 'c1',
  roundName: over.roundName || '一面',
  scheduledTime: over.scheduledTime || new Date(),
  status: over.status || ROUND_STATUS.PENDING,
  interviewer: over.interviewer,
  feedback: over.feedback,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over
});

describe('round store basic', () => {
  beforeEach(() => { setActivePinia(createPinia()); });

  it('adds and updates a round', async () => {
    const store = useRoundStore();
    const r = await store.addRound(makeRound());
    expect(store.rounds.length).toBe(1);
    await store.updateRound(r.id, { status: ROUND_STATUS.SCHEDULED });
    expect(store.rounds[0].status).toBe(ROUND_STATUS.SCHEDULED);
  });

  it('imports with id collision regenerates id', async () => {
    const store = useRoundStore();
    const r = await store.addRound(makeRound());
    const res = await store.importRounds([{ ...r }]);
    expect(res.imported).toBe(1);
    expect(store.rounds.length).toBe(2);
    expect(store.rounds[1].id).not.toBe(r.id);
  });
});
