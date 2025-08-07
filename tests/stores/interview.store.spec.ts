import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('@/utils/storage', () => ({
  STORAGE_KEYS: { INTERVIEW_PROCESSES: 'processes' },
  storageManager: {
    get: async () => [],
    set: async () => true
  }
}));

// @ts-ignore
import { useInterviewStore } from '@/stores/interview';

const makeProcess = (over: Partial<any> = {}) => ({
  companyId: over.companyId || 'c1',
  position: over.position || '前端工程师',
  city: over.city || '上海',
  sourceChannel: over.sourceChannel || '内推',
  status: over.status || '投递中',
  expectedSalary: over.expectedSalary || { base: 10, total: 12 },
  conclusion: over.conclusion || '',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over
});

describe('interview store basic', () => {
  beforeEach(() => { setActivePinia(createPinia()); });

  it('adds and updates a process', async () => {
    const store = useInterviewStore();
    const p = await store.addInterview(makeProcess());
    expect(store.interviews.length).toBe(1);
    await store.updateInterview(p.id, { status: '评估中' });
    expect(store.interviews[0].status).toBe('评估中');
  });

  it('import processes with id collision regenerates id', async () => {
    const store = useInterviewStore();
    const p = await store.addInterview(makeProcess());
    const res = await store.importInterviews([{ ...p }]);
    expect(res.imported).toBe(1);
    expect(store.interviews.length).toBe(2);
    expect(store.interviews[1].id).not.toBe(p.id);
  });
});
