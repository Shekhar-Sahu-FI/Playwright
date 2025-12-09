import { test, expect, request as playwrightRequest } from '@playwright/test';

const baseURL = 'https://stageapi.arpaerp.com/api';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiMDlkNzczOTQtZTdiZi00NDUwLWJjY2ItM2YzMDIxM2YzN2ZkIiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiMGQ1YzRhYmQtMzhjMi00ODEwLWFhZTQtYTZjZmJjZDE1YjY0IiwiZXhwIjoxNzY1MjY3MTg0LCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.K67psBBDOUEct_-UV1zsojTmU8gRF5NqVHe-E0FsA5k';
const masterEndpoints = {
  StateMaster: {
    getAll: '/GlobalData/StateMaster/GetAll',
    delete: '/GlobalData/StateMaster/Delete',
  },
  DepartmentMaster: {
    getAll: '/Organization/DepartmentMaster/GetAll',
    delete: '/Organization/DepartmentMaster/Delete',
  },
  ItemCategoryMaster: {
    getAll: '/Master/ItemCategoryMaster/GetAll',
    delete: '/master/ItemCategoryMaster/Delete',
  },

  ItemGroupMaster: {
    getAll: '/Master/ItemGroupMaster/GetAll',
    delete: '/Master/ItemGroupMaster/Delete',
  },

  UnitMaster: {
    getAll: '/Master/UnitMaster/GetAll',
    delete: '/Master/UnitMaster/Delete',
  },
  // Add more masters here as needed...
};

// ✅ Read master name from CLI (e.g., `--project="StateMaster"`)
const masterName = 'UnitMaster';

test.describe(`Delete Data By API`, () => {
  test(`Delete all records from ${masterName}`, async ({ request }) => {
    const masterConfig = masterEndpoints[masterName];
    if (!masterConfig) {
      throw new Error(`❌ No endpoint configuration found for master: ${masterName}`);
    }

    const getUrl = `${baseURL}${masterConfig.getAll}`;
    const deleteUrl = `${baseURL}${masterConfig.delete}`;

    console.log(`🔍 Fetching all records for: ${masterName}`);

    const getResponse = await request.get(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Get Response Status:', getResponse);
    expect(getResponse.ok()).toBeTruthy();

    const data = await getResponse.json();
    const allData = data.data;
    console.log(allData);

    if (!Array.isArray(allData) || allData.length === 0) {
      console.log(`✅ No records found for ${masterName}. Nothing to delete.`);
      return;
    }

    console.log(`🗑️ Found ${allData.length} records. Starting deletion...`);

    for (const item of allData) {
      const id = item.id || item.ID || item.masterId;
      if (!id) {
        console.warn(`⚠️ Skipping record with no valid ID: ${JSON.stringify(item)}`);
        continue;
      }

      const delResponse = await request.delete(`${deleteUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (delResponse.ok()) {
        console.log(`✅ Deleted ${masterName} → ID: ${id}`);
      } else {
        console.warn(`❌ Failed to delete ID: ${id}`);
      }
    }

    console.log(`🎯 Completed cleanup for ${masterName}`);
  });
});
