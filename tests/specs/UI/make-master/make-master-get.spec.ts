import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/MakeMaster/Get';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY3lmb2NhaG9AZGVuaXBsLmNvbSIsInRlbmFudE5vIjoiMTEiLCJ1c2VyUHJvZmlsZUlkIjoiQWRtaW4iLCJ1c2VySWQiOiIyOCIsInNlc3Npb25JZCI6IjQwOWI0YjI2LTBiZjctNGZlNC05NzJjLWMwYjA5MTg4ZDE1NyIsInN1YiI6ImN5Zm9jYWhvQGRlbmlwbC5jb20iLCJqdGkiOiIzMTE1MzBiNy0zNTM2LTRhNjgtOGQyNy00Y2Y0NDFkNWQxZjQiLCJleHAiOjE3NjYxMjI3MjAsImlzcyI6ImFycGFlcnAuY29tIiwiYXVkIjoiYXJwYWVycC5jb20ifQ.e8MsGXrNzmsfvi-by0LZOax1pXOKuLI4nk3iWWVX884';

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

test.describe('GET Make API – Query Parameter Validation', () => {
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
      makeName: body.data[0].makeName,
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

  test('GET makeName.Contains', async ({ request }) => {
    const part = baseRecord.makeName.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?makeName.Contains=${part}`, HEADER);
    console.log('res ==================>', res);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.makeName.includes(part));
  });

  test('GET Code.StartsWith', async ({ request }) => {
    const prefix = baseRecord.code.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?Code.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.code.startsWith(prefix));
  });

  test('GET makeName.StartsWith', async ({ request }) => {
    const prefix = baseRecord.makeName.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?makeName.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.makeName.startsWith(prefix));
  });

  /* ---------------- COMBINED FILTERS ---------------- */

  test('GET Combined filters', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?makeName.Eq=${baseRecord.statusNo}&Code.Eq=${baseRecord.code}`, HEADER);
    const body = await res.json();
    expectAll(body.data, (d: any) => d.makeName === baseRecord.makeName && d.code === baseRecord.code);
  });

  /* ---------------- SORTING  DESC---------------- */

  test('GET Sorting by Id desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'id')).toBe(true);
  });

  test('GET Sorting by Make name desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=makeName desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'makeName')).toBe(true);
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

  test('GET Sorting by Make name asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=makeName asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'makeName')).toBe(true);
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
