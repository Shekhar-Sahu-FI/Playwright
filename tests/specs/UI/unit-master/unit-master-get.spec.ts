import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/UnitMaster/Get';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY3lmb2NhaG9AZGVuaXBsLmNvbSIsInRlbmFudE5vIjoiMTEiLCJ1c2VyUHJvZmlsZUlkIjoiQWRtaW4iLCJ1c2VySWQiOiIyOCIsInNlc3Npb25JZCI6ImMzNTgxNzAwLTcxMjAtNDFkZC04YWQyLWNiZWRkZGFiZmFkMCIsInN1YiI6ImN5Zm9jYWhvQGRlbmlwbC5jb20iLCJqdGkiOiIyYTgyYjQ2YS0wOWYzLTQ3YTUtOTAxNi0xMGFiMDUxMGYyNjYiLCJleHAiOjE3NjYwNjMxNjAsImlzcyI6ImFycGFlcnAuY29tIiwiYXVkIjoiYXJwYWVycC5jb20ifQ.BzvA20sB0gr9b7URgxawzyMFX267Xh-PNoa-GHA2PJc';

const HEADER = {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

function expectAll<T>(data: T[], predicate: (item: T) => boolean) {
  for (const item of data) {
    console.log(predicate(item), item);
    expect(predicate(item)).toBeTruthy();
  }
}

function isSortedAsc<T>(data: T[], key: keyof T) {
  const values = data.map((d: any) => d[key]);
  return values.every((v, i, arr) => i === 0 || arr[i - 1] <= v);
}

function isSortedDesc<T>(data: T[], key: keyof T) {
  const values = data.map((d: any) => d[key]);
  return values.every((v, i, arr) => i === 0 || arr[i - 1] >= v);
}

test.describe('GET Units API – Query Parameter Validation', () => {
  let baseRecord: any;

  test.beforeAll(async ({ request }) => {
    const res = await request.get(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    baseRecord = {
      id: body.data[0].id,
      code: body.data[0].code,
      unitName: body.data[0].unitName,
    };
  });

  /* ---------------- EQ OPERATOR ---------------- */

  test('GET Id.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Eq=${baseRecord.id}`, HEADER);

    const body = await res.json();

    const idExists = body.data.some((item: any) => item.id === baseRecord.id);

    expect(idExists).toBe(true);
  });

  test('GET Code.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Code.Eq=${baseRecord.code}`, HEADER);
    const body = await res.json();

    const idExists = body.data.some((item: any) => item.code === baseRecord.code);

    expect(idExists).toBe(true);
  });

  // test('GET StatusNo.Eq', async ({ request }) => {
  //   const res = await request.get(`${ENDPOINT}?StatusNo.Eq=${baseRecord.statusNo}`, HEADER);
  //   const body = await res.json();

  //   expectAll(body.data, (d: any) => d.status.statusNo === baseRecord.statusNo);
  // });

  /* ---------------- COMPARISON OPERATORS ---------------- */

  test('GET Id.Gt', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Gt=${baseRecord.id - 1}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id > baseRecord.id - 1);
  });

  test('GET Id.Gte', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Gte=${baseRecord.id - 1}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id >= baseRecord.id - 1);
  });
  test('GET Id.Lt', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Lt=${baseRecord.id}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id < baseRecord.id);
  });
  test('GET Id.Lte', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Lte=${baseRecord.id}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id <= baseRecord.id);
  });

  // test('GET StatusNo.Gte', async ({ request }) => {
  //   const res = await request.get(`${ENDPOINT}?StatusNo.Gte=${baseRecord.statusNo}`, HEADER);
  //   const body = await res.json();

  //   expectAll(body.data, (d: any) => d.status.statsuNo >= baseRecord.statusNo);
  // });

  /* ---------------- STRING OPERATORS ---------------- */

  test('GET Code.Contains', async ({ request }) => {
    const part = baseRecord.code.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?Code.Contains=${part}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.code.includes(part));
  });

  test('GET UnitName.Contains', async ({ request }) => {
    const part = baseRecord.unitName.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?UnitName.Contains=${part}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.unitName.includes(part));
  });

  test('GET Code.StartsWith', async ({ request }) => {
    const prefix = baseRecord.code.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?Code.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.code.startsWith(prefix));
  });

  test('GET UnitName.StartsWith', async ({ request }) => {
    const prefix = baseRecord.unitName.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?UnitName.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.unitName.startsWith(prefix));
  });

  /* ---------------- COMBINED FILTERS ---------------- */

  test('GET Combined filters', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?UnitName.Eq=${baseRecord.statusNo}&Code.Eq=${baseRecord.code}`, HEADER);
    const body = await res.json();
    expectAll(body.data, (d: any) => d.unitName === baseRecord.unitName && d.code === baseRecord.code);
  });

  /* ---------------- SORTING  DESC---------------- */

  test('GET Sorting by Id desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'id')).toBe(true);
  });

  test('GET Sorting by Unit name desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=unitName desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'unitName')).toBe(true);
  });

  test('GET Sorting by code desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=code desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'code')).toBe(true);
  });

  // test('GET Sorting by createdDate desc', async ({ request }) => {
  //   const res = await request.get(`${ENDPOINT}?Sorting=createdBy desc`, HEADER);
  //   const body = await res.json();

  //   expect(isSortedDesc(body.data, 'createdBy')).toBe(true);
  // });

  /* ---------------- SORTING  ASC---------------- */

  test('GET Sorting by Id asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'id')).toBe(true);
  });

  test('GET Sorting by Unit name asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=unitName asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'unitName')).toBe(true);
  });

  test('GET Sorting by code acs', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=code acs`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'code')).toBe(true);
  });

  // test('GET Sorting by createdDate asc', async ({ request }) => {
  //   const res = await request.get(`${ENDPOINT}?Sorting=createdBy asc`, HEADER);
  //   const body = await res.json();

  //   expect(isSortedAsc(body.data, 'createdBy')).toBe(true);
  // });

  /* ---------------- PAGINATION ---------------- */

  test('GET Pagination PageNo & PageSize', async ({ request }) => {
    const page1 = await request.get(`${ENDPOINT}?PageNo=1&PageSize=5`, HEADER);
    const page2 = await request.get(`${ENDPOINT}?PageNo=2&PageSize=5`, HEADER);

    const body1 = await page1.json();
    const body2 = await page2.json();

    expect(body1.data.length).toBeLessThanOrEqual(5);
    expect(body2.data.length).toBeLessThanOrEqual(5);

    if (body2.data.length > 0) {
      expect(body1.data[0].id).not.toBe(body2.data[0].id);
    }
  });
});
