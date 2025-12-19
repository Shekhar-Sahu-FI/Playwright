import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/MakeMaster/Search';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY3lmb2NhaG9AZGVuaXBsLmNvbSIsInRlbmFudE5vIjoiMTEiLCJ1c2VyUHJvZmlsZUlkIjoiQWRtaW4iLCJ1c2VySWQiOiIyOCIsInNlc3Npb25JZCI6ImM5MzU2NzVhLTRiM2QtNGE4ZS04ZDdhLTFhY2Q5ZTg2OGZjMCIsInN1YiI6ImN5Zm9jYWhvQGRlbmlwbC5jb20iLCJqdGkiOiJkMDgzZjY3Ni0xYjg0LTRiNDQtODg3My0yNTE3ZDEyYWJhMGQiLCJleHAiOjE3NjYxMjMyNjksImlzcyI6ImFycGFlcnAuY29tIiwiYXVkIjoiYXJwYWVycC5jb20ifQ.G_J1Td8BWKUR10X_Is_n1l7rtTKKo3BU_2PcNhZ75dY';

const HEADER = {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

function expectAll<T>(data: T[], predicate: (item: T) => boolean) {
  for (const item of data) {
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

test.describe('Search Make API – Query Parameter Validation', () => {
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

    console.log('body ==================>', body);

    baseRecord = {
      id: body.data[0].id,
      code: body.data[0].code,
      makeName: body.data[0].makeName,
      statusNo: body.data[0].status.statusNo,
      createdDate: body.data[0].createdDate.split('T')[0],
      modifiedDate: body.data[0].modifiedDate.split('T')[0],
    };
  });

  /* ---------------- EQ OPERATOR ---------------- */

  test('Id.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Eq=${baseRecord.id}`, HEADER);

    const body = await res.json();

    expectAll(body.data, (d: any) => d.id === baseRecord.id);
  });

  test('Make Code.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Code.Eq=${baseRecord.code}`, HEADER);
    const body = await res.json();
    console.log('body ================>', body);
    expectAll(body.data, (d: any) => d.code === baseRecord.code);
  });

  test('MakeName.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?MakeName.Eq=${baseRecord.makeName}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.makeName === baseRecord.makeName);
  });

  test('StatusNo.Eq', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?StatusNo.Eq=${baseRecord.statusNo}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.status.statusNo === baseRecord.statusNo);
  });

  /* ---------------- COMPARISON OPERATORS ---------------- */

  test('Id.Gt', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Gt=${baseRecord.id - 1}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id > baseRecord.id - 1);
  });

  test('Id.Lte', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Id.Lte=${baseRecord.id}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.id <= baseRecord.id);
  });

  // test('StatusNo.Gte', async ({ request }) => {
  //   const res = await request.get(`${ENDPOINT}?StatusNo.Gte=${baseRecord.statusNo}`, HEADER);
  //   const body = await res.json();

  //   expectAll(body.data, (d: any) => d.status.statsuNo >= baseRecord.statusNo);
  // });

  /* ---------------- STRING OPERATORS ---------------- */

  test('Code.Contains', async ({ request }) => {
    const part = baseRecord.code.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?Code.Contains=${part}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.code.includes(part));
  });

  test('MakeName.StartsWith', async ({ request }) => {
    const prefix = baseRecord.makeName.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?MakeName.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.makeName.startsWith(prefix));
  });

  /* ---------------- DATE OPERATORS ---------------- */

  test('CreatedDate.Gte', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?CreatedDate.Gte=${baseRecord.createdDate}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => new Date(d.createdDate) >= new Date(baseRecord.createdDate));
  });

  test('ModifiedDate.Lte', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?ModifiedDate.Lte=${baseRecord.modifiedDate}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => new Date(d.modifiedDate.split('T')[0]) <= new Date(baseRecord.modifiedDate));
  });

  /* ---------------- COMBINED FILTERS ---------------- */

  test('Combined filters', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?StatusNo.Eq=${baseRecord.statusNo}&Code.Eq=${baseRecord.code}`, HEADER);
    const body = await res.json();
    expectAll(body.data, (d: any) => d.status.statusNo === baseRecord.statusNo && d.code === baseRecord.code);
  });

  /* ---------------- SORTING  DESC---------------- */

  test('Sorting by Id desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'id')).toBe(true);
  });

  test('Sorting by Make name desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=makeName desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'makeName')).toBe(true);
  });

  test('Sorting by code desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=code desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'code')).toBe(true);
  });

  test('Sorting by createdDate desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=createdBy desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'createdBy')).toBe(true);
  });

  /* ---------------- SORTING  ASC---------------- */

  test('Sorting by Id asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'id')).toBe(true);
  });

  test('Sorting by Make name asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=makeName asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'makeName')).toBe(true);
  });

  test('Sorting by code acs', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=code acs`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'code')).toBe(true);
  });

  test('Sorting by createdDate asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=createdBy asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'createdBy')).toBe(true);
  });

  /* ---------------- PAGINATION ---------------- */

  test('Pagination PageNo & PageSize', async ({ request }) => {
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
