import { test, expect } from '@playwright/test';

const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/ItemCategoryMaster/Get';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiYjY3ZjE0ODctNjE0ZS00YmE4LTkwMzUtZjIwNGViOGE2MWE3Iiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiZTBhODExZmUtN2QzNy00ZmVjLWJhZGQtNGQyOTY5NDkxYWJiIiwiZXhwIjoxNzY2MTUxMjU1LCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.I1nRiUsE51tk-qG8tXIR_9ChQlGC0JShArJv4U1_bLw';

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

test.describe('GET Item Category Master API – Query Parameter Validation', () => {
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
      itemCategoryName: body.data[0].itemCategoryName,
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

  test('GET ItemCategory.Contains', async ({ request }) => {
    const part = baseRecord.itemCategoryName.substring(0, 2);
    const res = await request.get(`${ENDPOINT}?ItemCategoryName.Contains=${part}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.itemCategoryName.includes(part));
  });

  test('GET Code.StartsWith', async ({ request }) => {
    const prefix = baseRecord.code.substring(0, 1);
    const res = await request.get(`${ENDPOINT}?Code.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.code.startsWith(prefix));
  });

  test('GET ItemCategory.StartsWith', async ({ request }) => {
    const prefix = baseRecord.itemCategoryName.substring(0, 2);

    console.log('prefix ==================>', prefix);
    const res = await request.get(`${ENDPOINT}?ItemCategoryName.StartsWith=${prefix}`, HEADER);
    const body = await res.json();

    expectAll(body.data, (d: any) => d.itemCategoryName.startsWith(prefix));
  });

  /* ---------------- COMBINED FILTERS ---------------- */

  test('GET Combined filters', async ({ request }) => {
    const res = await request.get(
      `${ENDPOINT}?ItemCategory.Eq=${baseRecord.statusNo}&Code.Eq=${baseRecord.code}`,
      HEADER,
    );
    const body = await res.json();
    expectAll(body.data, (d: any) => d.itemCategoryName === baseRecord.itemCategoryName && d.code === baseRecord.code);
  });

  /* ---------------- SORTING  DESC---------------- */

  test('GET Sorting by Id desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=id desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'id')).toBe(true);
  });

  test('GET Sorting by ItemCategory name desc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=itemCategoryName desc`, HEADER);
    const body = await res.json();

    expect(isSortedDesc(body.data, 'itemCategoryName')).toBe(true);
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

  test('GET Sorting by ItemCategory name asc', async ({ request }) => {
    const res = await request.get(`${ENDPOINT}?Sorting=itemCategoryName asc`, HEADER);
    const body = await res.json();

    expect(isSortedAsc(body.data, 'itemCategoryName')).toBe(true);
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
