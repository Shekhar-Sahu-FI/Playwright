import { test, expect } from '@playwright/test';

// ================= CONFIG =================
const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/ItemSubgroupMaster/Get';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiZDUzNzAyNzItOTBiYi00N2EwLWJkNzktMWQzZDkyZjA1N2YzIiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiZmU5YjZlYWItNzg5MC00ZDJhLThkMjQtYjA0ZGViMTRiOWM3IiwiZXhwIjoxNzY3ODUyODc0LCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.4f46nPT8OOb99knKuHfF29DVY7UsEp5V0t8GkpUgTME';
const BUID = '25';
const PAGE_SIZE = 20;

// ================= FILTER CONFIG =================
type FieldType = 'number' | 'string';
type Operator = 'Eq' | 'Gt' | 'Gte' | 'Lt' | 'Lte' | 'Contains' | 'StartsWith';

interface FieldConfig {
  type: FieldType;
  ops: Operator[];
}

/**
 * 👉 Update this object ONLY when API changes
 */
const FILTER_FIELDS: Record<string, FieldConfig> = {
  Id: { type: 'number', ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'] },

  Code: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },

  ItemName: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },

  SubgroupCode: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },
  SubgroupId: { type: 'number', ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'] },
  SubgroupName: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },

  GroupName: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },
  GroupId: { type: 'number', ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'] },
  GroupCode: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },

  CategoryName: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },
  CategoryId: { type: 'number', ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'] },
  CategoryCode: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'] },
};

const returnFieldName = (field: string) => {
  const FIELD_MAP: Record<string, string> = {
    Id: 'id',
    Code: 'code',
    ItemName: 'itemName',

    SubgroupCode: 'itemSubgroupCode',
    SubgroupId: 'itemSubgroupId',
    SubgroupName: 'itemSubgroupName',

    GroupName: 'itemGroup.itemGroupName',
    GroupId: 'itemGroup.id',
    GroupCode: 'itemGroup.code',

    CategoryName: 'itemCategory.itemCategoryName',
    CategoryId: 'itemCategory.id',
    CategoryCode: 'itemCategory.code',
  };

  return FIELD_MAP[field];
};

// ================= SORT CONFIG =================
const SORTABLE_FIELDS = ['id', 'code', 'itemSubgroupName', 'itemGroupName', 'itemCategoryName'];
// ================= OPERATORS =================
const operators = {
  Eq: (a: any, b: any) => String(a).toLowerCase() === String(b).toLowerCase(),
  Gt: (a: any, b: any) => Number(a) > Number(b),
  Gte: (a: any, b: any) => Number(a) >= Number(b),
  Lt: (a: any, b: any) => Number(a) < Number(b),
  Lte: (a: any, b: any) => Number(a) <= Number(b),
  Contains: (a: any, b: any) => String(a).toLowerCase().includes(String(b).toLowerCase()),
  StartsWith: (a: any, b: any) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
};

// ================= HELPERS =================
const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  buid: BUID,
};

const toCamel = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// ================= TEST RUNNER =================
async function runFilterTests(request: any) {
  // ---------- Base Fetch ----------
  const baseRes = await request.get(`${ENDPOINT}`, {
    headers,
    params: { PageNo: 1, PageSize: PAGE_SIZE },
  });

  expect(baseRes.ok()).toBeTruthy();
  const baseBody = await baseRes.json();
  expect(baseBody.data.length).toBeGreaterThan(0);

  const sample = baseBody.data[0];

  // ---------- Filter Tests ----------
  for (const [field, config] of Object.entries(FILTER_FIELDS)) {
    const responseField = returnFieldName(field);
    const value = sample[responseField];
    if (value === undefined || value === null) continue;

    for (const op of config.ops) {
      let testValue = value;

      if (config.type === 'string') {
        if (op === 'Contains') testValue = String(value).slice(0, 2);
        if (op === 'StartsWith') testValue = String(value)[0];
      }

      if (config.type === 'number') {
        if (op === 'Gt') testValue = value - 1;
        if (op === 'Lt') testValue = value + 1;
      }

      await test.step(`${field}.${op}`, async () => {
        const res = await request.get(ENDPOINT, {
          headers,
          params: { [`${field}.${op}`]: testValue },
        });

        expect.soft(res.ok()).toBeTruthy();
        const body = await res.json();

        body.data.forEach((item: any) => {
          expect.soft(operators[op](item[responseField], testValue)).toBeTruthy();
        });
      });
    }
  }

  // ---------- Keyword Search ----------
  await test.step('KeywordSearch', async () => {
    const keyword = 'IT';
    const res = await request.get(ENDPOINT, {
      headers,
      params: { KeywordSearch: keyword },
    });
    expect(res.ok()).toBeTruthy();
  });

  // ---------- Sorting ----------
  for (const field of SORTABLE_FIELDS) {
    await test.step(`Sorting ${field} asc`, async () => {
      const res = await request.get(ENDPOINT, {
        headers,
        params: { Sorting: `${field} asc` },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      const data = body.data;

      for (let i = 0; i < data.length - 1; i++) {
        expect.soft(String(data[i][field]).localeCompare(String(data[i + 1][field])) <= 0).toBeTruthy();
      }
    });

    await test.step(`Sorting ${field} desc`, async () => {
      const res = await request.get(ENDPOINT, {
        headers,
        params: { Sorting: `${field} desc` },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      const data = body.data;

      for (let i = 0; i < data.length - 1; i++) {
        expect.soft(String(data[i][field]).localeCompare(String(data[i + 1][field])) >= 0).toBeTruthy();
      }
    });
  }

  // ---------- Pagination ----------
  await test.step('Pagination', async () => {
    const res = await request.get(ENDPOINT, {
      headers,
      params: { PageNo: 1, PageSize: 5 },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.length).toBeLessThanOrEqual(5);
  });
}

// ================= SPEC =================
test.describe('ItemSubgroupMaster – API Filter Validation', () => {
  test('Validate all filters, sorting, search & pagination', async ({ request }) => {
    await runFilterTests(request);
  });
});
