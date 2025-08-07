import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Mock storage layer to avoid IndexedDB
vi.mock('@/utils/storage', () => {
  const data = new Map<string, any>();
  return {
    STORAGE_KEYS: {
      COMPANIES: 'companies',
    },
    storageManager: {
      get: async (k: string) => data.get(k) ?? null,
      set: async (k: string, v: any) => { data.set(k, v); return true; },
    }
  };
});

// @ts-ignore temporary path mapping for tests
import { useCompanyStore } from '@/stores/company';

const makeCompany = (over: Partial<any> = {}) => ({
  id: over.id || Math.random().toString(36).slice(2),
  name: over.name || 'ACME',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

describe('company store import logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('append mode filters duplicates by name', async () => {
    const store = useCompanyStore();
    const c1 = makeCompany({ name: 'A' });
    await store.importCompanies([c1], { mode: 'append' });
    const result = await store.importCompanies([c1, makeCompany({ name: 'B' })], { mode: 'append' });
    expect(result.imported).toBe(1); // only B
    expect(result.skipped).toBe(1); // duplicate A
  });

  it('replace mode overwrites all', async () => {
    const store = useCompanyStore();
    await store.importCompanies([makeCompany({ name: 'Old' })], { mode: 'replace' });
    const res = await store.importCompanies([makeCompany({ name: 'New1' }), makeCompany({ name: 'New2' })], { mode: 'replace' });
    expect(store.companies.length).toBe(2);
    expect(res.imported).toBe(2);
  });

  it('merge mode fills only empty fields', async () => {
    const store = useCompanyStore();
    const existing = makeCompany({ name: 'MergeCo', industry: 'Tech', size: undefined });
    await store.importCompanies([existing], { mode: 'replace' });
    const merged = makeCompany({ name: 'MergeCo', size: '100-500', industry: 'ShouldNotOverride' });
    const res = await store.importCompanies([merged], { mode: 'merge' });
    const stored = store.companies.find(c => c.name === 'MergeCo');
    expect(stored?.industry).toBe('Tech'); // not overridden
    expect(stored?.size).toBe('100-500'); // filled
    expect(res.merged + res.skipped + res.imported).toBeGreaterThanOrEqual(1);
  });
});
