// import { test, expect } from '@playwright/test';

// // ================= CONFIG =================
// const ENDPOINT = 'https://stageapi.arpaerp.com/api/Master/ItemMaster/Search';

// const ACCESS_TOKEN =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiZTVmNDc5MTMtYWFjOS00MjU0LWI1NGUtNTdkZjkzNzBlYjNmIiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiNTFkNWU1NDgtNGQ4NS00ZGVmLWIyZGUtNmZjOWJhMjgyNmViIiwiZXhwIjoxNzY3ODYwMzM3LCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.2GZKuLoDJi-j0cAfn1evvh5hdUwoGr7VkcOA8YLZGHI';
// const BUID = '25';
// const PAGE_SIZE = 20;

// // ================= TYPES =================
// type FieldType = 'number' | 'string' | 'date';
// type Operator = 'Eq' | 'Gt' | 'Gte' | 'Lt' | 'Lte' | 'Contains' | 'StartsWith';

// interface FieldConfig {
//   type: FieldType;
//   ops: Operator[];
//   responsePath: string;
// }

// // ================= FILTER CONFIG =================
// const FILTER_FIELDS: Record<string, FieldConfig> = {
//   Id: { type: 'number', ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'], responsePath: 'id' },

//   Code: { type: 'string', ops: ['Eq', 'Contains', 'StartsWith'], responsePath: 'code' },

//   ItemName: {
//     type: 'string',
//     ops: ['Eq', 'Contains', 'StartsWith'],
//     responsePath: 'itemName',
//   },

//   ItemSubgroupName: {
//     type: 'string',
//     ops: ['Eq', 'Contains', 'StartsWith'],
//     responsePath: 'subgroup.itemSubgroupName',
//   },

//   ItemGroupName: {
//     type: 'string',
//     ops: ['Eq', 'Contains', 'StartsWith'],
//     responsePath: 'group.itemGroupName',
//   },

//   ItemCategoryName: {
//     type: 'string',
//     ops: ['Eq', 'Contains', 'StartsWith'],
//     responsePath: 'category.itemCategoryName',
//   },

//   UnitName: {
//     type: 'string',
//     ops: ['Eq', 'Contains', 'StartsWith'],
//     responsePath: 'unit.unitName',
//   },

//   CreatedDate: {
//     type: 'date',
//     ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
//     responsePath: 'createdDate',
//   },

//   ModifiedDate: {
//     type: 'date',
//     ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
//     responsePath: 'modifiedDate',
//   },

//   StatusNo: {
//     type: 'number',
//     ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
//     responsePath: 'status.statusNo',
//   },
// };

// // ================= SORT CONFIG =================
// const SORTABLE_FIELDS: Record<string, FieldType> = {
//   id: 'number',
//   code: 'string',
//   itemName: 'string',
//   createdDate: 'date',
//   modifiedDate: 'date',
// };

// // ================= HEADERS =================
// const headers = {
//   Authorization: `Bearer ${ACCESS_TOKEN}`,
//   buid: BUID,
// };

// // ================= HELPERS =================
// function getValueByPath(obj: any, path: string) {
//   return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
// }

// function normalizeDate(value: string) {
//   return new Date(value).toISOString();
// }

// const operators = {
//   Eq: (a: any, b: any, t: FieldType) => (t === 'date' ? new Date(a).getTime() === new Date(b).getTime() : a === b),

//   Gt: (a: any, b: any, t: FieldType) =>
//     t === 'date' ? new Date(a).getTime() > new Date(b).getTime() : Number(a) > Number(b),

//   Gte: (a: any, b: any, t: FieldType) =>
//     t === 'date' ? new Date(a).getTime() >= new Date(b).getTime() : Number(a) >= Number(b),

//   Lt: (a: any, b: any, t: FieldType) =>
//     t === 'date' ? new Date(a).getTime() < new Date(b).getTime() : Number(a) < Number(b),

//   Lte: (a: any, b: any, t: FieldType) =>
//     t === 'date' ? new Date(a).getTime() <= new Date(b).getTime() : Number(a) <= Number(b),

//   Contains: (a: any, b: any) => String(a).toLowerCase().includes(String(b).toLowerCase()),

//   StartsWith: (a: any, b: any) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
// };

// function compareDesc(a: any, b: any, type: FieldType) {
//   if (type === 'date') return new Date(a).getTime() >= new Date(b).getTime();
//   if (type === 'number') return Number(a) >= Number(b);
//   return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }) >= 0;
// }

// // ================= TEST =================
// test.describe('Item Master – Search API Validation', () => {
//   test('Validate filters, sorting and pagination', async ({ request }) => {
//     // ---------- BASE ----------
//     const baseRes = await request.get(ENDPOINT, {
//       headers,
//       params: { PageNo: 1, PageSize: PAGE_SIZE },
//     });

//     expect(baseRes.ok()).toBeTruthy();
//     const baseBody = await baseRes.json();
//     expect(baseBody.data.length).toBeGreaterThan(0);

//     const sample = baseBody.data[0];

//     // ---------- FILTERS ----------
//     for (const [field, config] of Object.entries(FILTER_FIELDS)) {
//       const rawValue = getValueByPath(sample, config.responsePath);
//       if (rawValue === undefined || rawValue === null) continue;

//       for (const op of config.ops) {
//         let testValue = rawValue;

//         if (config.type === 'string') {
//           if (op === 'Contains') testValue = String(rawValue).slice(0, 3);
//           if (op === 'StartsWith') testValue = String(rawValue)[0];
//         }

//         if (config.type === 'number') {
//           if (op === 'Gt') testValue = rawValue - 1;
//           if (op === 'Lt') testValue = rawValue + 1;
//         }

//         if (config.type === 'date') {
//           testValue = normalizeDate(rawValue);
//         }

//         await test.step(`${field}.${op}`, async () => {
//           const res = await request.get(ENDPOINT, {
//             headers,
//             params: { [`${field}.${op}`]: testValue },
//           });

//           expect.soft(res.ok()).toBeTruthy();
//           const body = await res.json();

//           body.data.forEach((item: any) => {
//             const actual = getValueByPath(item, config.responsePath);
//             expect.soft(operators[op](actual, testValue, config.type)).toBeTruthy();
//           });
//         });
//       }
//     }

//     // ---------- SORTING ----------
//     for (const [field, type] of Object.entries(SORTABLE_FIELDS)) {
//       await test.step(`Sorting ${field} desc`, async () => {
//         const res = await request.get(ENDPOINT, {
//           headers,
//           params: { Sorting: `${field} desc` },
//         });

//         expect(res.ok()).toBeTruthy();
//         const body = await res.json();
//         const data = body.data;

//         for (let i = 0; i < data.length - 1; i++) {
//           expect.soft(compareDesc(data[i][field], data[i + 1][field], type)).toBeTruthy();
//         }
//       });
//     }

//     // ---------- PAGINATION ----------
//     await test.step('Pagination', async () => {
//       const res = await request.get(ENDPOINT, {
//         headers,
//         params: { PageNo: 1, PageSize: 5 },
//       });

//       expect(res.ok()).toBeTruthy();
//       const body = await res.json();
//       expect(body.data.length).toBeLessThanOrEqual(5);
//     });
//   });
// });

import { test, expect } from '@playwright/test';

// ================= CONFIG =================
const ENDPOINT = 'https://stageapi.arpaerp.com/api/Inventory/MaterialReturn/Search';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGFtYXhpMzg4MkBhbWV0aXRhcy5jb20iLCJ0ZW5hbnRObyI6IjgiLCJ1c2VyUHJvZmlsZUlkIjoiQWRtaW4iLCJ1c2VySWQiOiIxNCIsInNlc3Npb25JZCI6IjFjNjc1NDQ1LWNjMTYtNDEzMS1iMTlmLTQ0NTBkMzY4MzZkNiIsInN1YiI6InBhbWF4aTM4ODJAYW1ldGl0YXMuY29tIiwianRpIjoiMDE0NmQ1MDktYzVjZS00ODUyLWI4MDAtMTM3NGUyMzMyZWUxIiwiZXhwIjoxNzY3ODc0OTAzLCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.f1g8YZDR6NjxdYQP2Z4NlzaQ2-3w9qsAAIoc6GXFmr4';
const BUID = '24';
const PAGE_SIZE = 20;

// ================= TYPES =================
type FieldType = 'number' | 'string' | 'date';
type Operator = 'Eq' | 'Gt' | 'Gte' | 'Lt' | 'Lte' | 'Contains' | 'StartsWith';

interface FieldConfig {
  type: FieldType;
  ops: Operator[];
  responsePath: string;
}

// ================= FILTER CONFIG =================
const FILTER_FIELDS: Record<string, FieldConfig> = {
  Id: {
    type: 'number',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'id',
  },

  DocNoYearly: {
    type: 'string',
    ops: ['Eq', 'Contains', 'StartsWith'],
    responsePath: 'docNoYearly',
  },

  CreatedDate: {
    type: 'date',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'createdDate',
  },

  ModifiedDate: {
    type: 'date',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'modifiedDate',
  },

  // DocDate: {
  //   type: 'date',
  //   ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
  //   responsePath: 'docDate',
  // },

  WarehouseName: {
    type: 'string',
    ops: ['Eq', 'Contains', 'StartsWith'],
    responsePath: 'warehouse.warehouseName',
  },

  DepartmentName: {
    type: 'string',
    ops: ['Eq', 'Contains', 'StartsWith'],
    responsePath: 'department.departmentName',
  },

  WarehouseId: {
    type: 'number',
    ops: ['Eq'],
    responsePath: 'warehouse.id',
  },

  DepartmentId: {
    type: 'number',
    ops: ['Eq'],
    responsePath: 'department.id',
  },

  RefDocTypeNo: {
    type: 'number',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'refDocType.refDocTypeNo',
  },

  DocStatusNo: {
    type: 'number',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'docStatus.docStatusNo',
  },

  StockNatureNo: {
    type: 'number',
    ops: ['Eq', 'Gt', 'Gte', 'Lt', 'Lte'],
    responsePath: 'stockNature.stockNatureNo',
  },
};

// ================= SORT CONFIG =================
const SORTABLE_FIELDS: Record<string, FieldType> = {
  id: 'number',
  docNoYearly: 'string',
  docDate: 'date',
  createdDate: 'date',
  modifiedDate: 'date',
};

// ================= HEADERS =================
const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  buid: BUID,
};

// ================= HELPERS =================
function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function normalizeDate(value: string) {
  return new Date(value).toISOString();
}

const operators = {
  Eq: (a: any, b: any, t: FieldType) => (t === 'date' ? new Date(a).getTime() === new Date(b).getTime() : a === b),

  Gt: (a: any, b: any, t: FieldType) =>
    t === 'date' ? new Date(a).getTime() > new Date(b).getTime() : Number(a) > Number(b),

  Gte: (a: any, b: any, t: FieldType) =>
    t === 'date' ? new Date(a).getTime() >= new Date(b).getTime() : Number(a) >= Number(b),

  Lt: (a: any, b: any, t: FieldType) =>
    t === 'date' ? new Date(a).getTime() < new Date(b).getTime() : Number(a) < Number(b),

  Lte: (a: any, b: any, t: FieldType) =>
    t === 'date' ? new Date(a).getTime() <= new Date(b).getTime() : Number(a) <= Number(b),

  Contains: (a: any, b: any) => String(a).toLowerCase().includes(String(b).toLowerCase()),

  StartsWith: (a: any, b: any) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
};

function compareDesc(a: any, b: any, type: FieldType) {
  if (type === 'date') return new Date(a).getTime() >= new Date(b).getTime();
  if (type === 'number') return Number(a) >= Number(b);
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }) >= 0;
}

// ================= TEST =================
test.describe('Material Return – Search API Validation', () => {
  test('Validate filters, sorting and pagination', async ({ request }) => {
    // ---------- BASE ----------
    const baseRes = await request.get(ENDPOINT, {
      headers,
      params: { PageNo: 1, PageSize: PAGE_SIZE },
    });

    expect(baseRes.ok()).toBeTruthy();
    const baseBody = await baseRes.json();
    expect(baseBody.data.length).toBeGreaterThan(0);

    const sample = baseBody.data[0];

    // ---------- FILTERS ----------
    for (const [field, config] of Object.entries(FILTER_FIELDS)) {
      const rawValue = getValueByPath(sample, config.responsePath);
      if (rawValue === undefined || rawValue === null) continue;

      for (const op of config.ops) {
        let testValue: any = rawValue;

        if (config.type === 'string') {
          if (op === 'Contains') testValue = String(rawValue).slice(0, 3);
          if (op === 'StartsWith') testValue = String(rawValue)[0];
        }

        if (config.type === 'number') {
          if (op === 'Gt') testValue = rawValue - 1;
          if (op === 'Lt') testValue = rawValue + 1;
        }

        if (config.type === 'date') {
          testValue = normalizeDate(rawValue);
        }

        await test.step(`${field}.${op}`, async () => {
          const res = await request.get(ENDPOINT, {
            headers,
            params: { [`${field}.${op}`]: testValue },
          });

          expect.soft(res.ok()).toBeTruthy();
          const body = await res.json();

          body.data.forEach((item: any) => {
            const actual = getValueByPath(item, config.responsePath);
            expect.soft(operators[op](actual, testValue, config.type)).toBeTruthy();
          });
        });
      }
    }

    // ---------- SORTING ----------
    for (const [field, type] of Object.entries(SORTABLE_FIELDS)) {
      await test.step(`Sorting ${field} desc`, async () => {
        const res = await request.get(ENDPOINT, {
          headers,
          params: { Sorting: `${field} desc` },
        });

        expect(res.ok()).toBeTruthy();
        const body = await res.json();
        const data = body.data;

        for (let i = 0; i < data.length - 1; i++) {
          expect.soft(compareDesc(data[i][field], data[i + 1][field], type)).toBeTruthy();
        }
      });
    }

    // ---------- PAGINATION ----------
    await test.step('Pagination', async () => {
      const res = await request.get(ENDPOINT, {
        headers,
        params: { PageNo: 1, PageSize: 5 },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.length).toBeLessThanOrEqual(5);
    });
  });
});
