import { test, expect } from '@playwright/test';

// ================= CONFIG =================
const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/ItemSubgroupMaster/Get';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiMzZjMTY4MmItZWI1NS00OGMwLThlNTUtN2JmM2E3OTNhYjE5Iiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiZThlODQ0ODAtNzdiYy00MDVlLThmNzEtMDE5OTMyMjE5ZTc0IiwiZXhwIjoxNzY3NzkyODYzLCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.B7ebc-RAHF5MtjsjhSaazWEQa3Y8uDK-XLkb-HMtOYw';
const PAGE_SIZE = 20;
// ==========================================

const SORTABLE_FIELDS = [
  'code',
  'itemGroupName',
  'id',
  'createdDate',
  'itemCategoryName',
  'itemSubgroupName',
  'modifiedDate',
];

// -------------------- Helpers --------------------
function isNumber(value: any): boolean {
  return value !== null && value !== '' && !isNaN(Number(value));
}

function toQueryField(field: string): string {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

// -------------------- Operators --------------------
const operators = {
  Eq: (a: any, b: any) =>
    isNumber(a) && isNumber(b) ? Number(a) === Number(b) : String(a).toLowerCase() === String(b).toLowerCase(),

  Gt: (a: any, b: any) => Number(a) > Number(b),
  Gte: (a: any, b: any) => Number(a) >= Number(b),
  Lt: (a: any, b: any) => Number(a) < Number(b),
  Lte: (a: any, b: any) => Number(a) <= Number(b),

  Contains: (a: any, b: any) => String(a).toLowerCase().includes(String(b).toLowerCase()),

  StartsWith: (a: any, b: any) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
};

// -------------------- Runner --------------------
async function runFilterTests(request: any) {
  // 1️⃣ Get All
  const baseRes = await request.get(`${ENDPOINT.replace('Get', 'Search')}`, {
    params: { PageNo: 1, PageSize: PAGE_SIZE },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      buid: '25',
    },
  });
  console.log('Base records count:', baseRes);

  expect.soft(baseRes.ok()).toBeTruthy();
  const baseBody = await baseRes.json();
  expect.soft(baseBody.data?.length).toBeGreaterThan(0);
  const sample = baseBody.data[0];

  const EXCLUDED_FIELDS = ['tenantNo', 'modifiedBy', 'createdBy'];
  const fields = Object.entries(sample).filter(([key, value]) => {
    if (EXCLUDED_FIELDS.includes(key)) return false;
    return typeof value === 'string' || typeof value === 'number';
  });

  for (const [field, value] of fields) {
    const queryField = toQueryField(field);

    // ---------- EQ ----------
    await test.step(`${queryField}.Eq`, async () => {
      const res = await request.get(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          buid: '25',
        },
        params: { [`${queryField}.Eq`]: String(value) },
      });

      expect.soft(res.ok()).toBeTruthy();
      const body = await res.json();

      body.data.forEach((item: any) => {
        expect.soft(operators.Eq(item[field], value)).toBeTruthy();
      });
    });

    // ---------- STRING OPS ----------
    if (typeof value === 'string' && value.length >= 2 && !value.includes('Date')) {
      const token = value.slice(0, 2);

      await test.step(`${queryField}.Contains`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.Contains`]: token },
        });

        expect.soft(res.ok()).toBeTruthy();
        const body = await res.json();

        body.data.forEach((item: any) => {
          expect.soft(operators.Contains(item[field], token)).toBeTruthy();
        });
      });

      await test.step(`${queryField}.StartsWith`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.StartsWith`]: value[0] },
        });

        expect.soft(res.ok()).toBeTruthy();
        const body = await res.json();

        body.data.forEach((item: any) => {
          expect.soft(operators.StartsWith(item[field], value[0])).toBeTruthy();
        });
      });
    }

    // ---------- NUMBER OPS ----------

    console.log(value, 'dasdasdasdasd', String(value).includes('Date'));
    if (isNumber(value) || String(value).includes('Date')) {
      const num = Number(value);

      await test.step(`${queryField}.Gt`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.Gt`]: num - 1 },
        });
        expect.soft(res.ok()).toBeTruthy();
      });

      await test.step(`${queryField}.Gte`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.Gte`]: num },
        });
        expect.soft(res.ok()).toBeTruthy();
      });

      await test.step(`${queryField}.Lt`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.Lt`]: num + 1 },
        });
        expect.soft(res.ok()).toBeTruthy();
      });

      await test.step(`${queryField}.Lte`, async () => {
        const res = await request.get(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            buid: '25',
          },
          params: { [`${queryField}.Lte`]: num },
        });
        expect.soft(res.ok()).toBeTruthy();
      });
    }
  }

  // ---------- SORTING ----------
  for (const apiField of SORTABLE_FIELDS) {
    const responseField = apiField; // already camelCase

    function isDateValue(value: any): boolean {
      if (typeof value !== 'string') return false;
      const time = Date.parse(value);
      return !isNaN(time);
    }

    // Skip if field not present in response
    if (!(responseField in sample)) continue;

    await test.step(`Sorting ${apiField} acs`, async () => {
      const res = await request.get(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          buid: '25',
        },
        params: { Sorting: `${responseField} acs` },
      });

      expect.soft(res.ok()).toBeTruthy();
      const body = await res.json();

      const data = body.data;
      expect.soft(data.length).toBeGreaterThan(1);

      for (let i = 0; i < data.length - 1; i++) {
        const current = data[i][responseField];
        const next = data[i + 1][responseField];

        // ---- DATE SORTING ----
        if (isDateValue(current) && isDateValue(next)) {
          expect
            .soft(new Date(current).getTime() <= new Date(next).getTime(), `${responseField} date sorting failed`)
            .toBeTruthy();
          continue;
        }

        // ---- STRING SORTING ----
        if (typeof current === 'string' && typeof next === 'string') {
          expect.soft(current.localeCompare(next) <= 0, `${responseField} string sorting failed`).toBeTruthy();
          continue;
        }

        // ---- NUMBER SORTING ----
        if (typeof current === 'number' && typeof next === 'number') {
          expect.soft(current <= next, `${responseField} number sorting failed`).toBeTruthy();
        }
      }
    });
  }

  for (const apiField of SORTABLE_FIELDS) {
    const responseField = apiField; // already camelCase

    function isDateValue(value: any): boolean {
      if (typeof value !== 'string') return false;
      const time = Date.parse(value);
      return !isNaN(time);
    }

    // Skip if field not present in response
    if (!(responseField in sample)) continue;

    await test.step(`Sorting ${apiField} desc`, async () => {
      const res = await request.get(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          buid: '25',
        },
        params: { Sorting: `${responseField} desc` },
      });

      expect.soft(res.ok()).toBeTruthy();
      const body = await res.json();

      const data = body.data;
      expect.soft(data.length).toBeGreaterThan(1);

      for (let i = 0; i < data.length - 1; i++) {
        const current = data[i][responseField];
        const next = data[i + 1][responseField];

        // ---- DATE SORTING ----
        if (isDateValue(current) && isDateValue(next)) {
          expect
            .soft(new Date(current).getTime() >= new Date(next).getTime(), `${responseField} date sorting failed`)
            .toBeTruthy();
          continue;
        }

        // ---- STRING SORTING ----
        if (typeof current === 'string' && typeof next === 'string') {
          const normalize = (v: string) => v.trim().toLowerCase();

          expect
            .soft(
              normalize(current).localeCompare(normalize(next), undefined, { sensitivity: 'base' }) >= 0,
              `${responseField} sorting failed: "${current}" < "${next}"`,
            )
            .toBeTruthy();
          continue;
        }

        // ---- NUMBER SORTING ----
        if (typeof current === 'number' && typeof next === 'number') {
          expect.soft(current >= next, `${responseField} number sorting failed`).toBeTruthy();
        }
      }
    });
  }
}
// -------------------- Spec --------------------
test.describe('Generic API – Full Filter Validation', () => {
  test('Validate all filter operations', async ({ request }) => {
    await runFilterTests(request);
  });
});
