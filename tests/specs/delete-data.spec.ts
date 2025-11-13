import { test, expect, request as playwrightRequest } from '@playwright/test';

const baseURL = 'http://192.168.0.35:5302/api';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic2hla2hhci5zYWh1QGFycGFlcnAuY29tIiwidGVuYW50Tm8iOiIyNyIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjE2Iiwic3ViIjoic2hla2hhci5zYWh1QGFycGFlcnAuY29tIiwianRpIjoiY2RlYWQ3N2UtYzViOS00NjIyLTk2MDktMTNlN2U4MjdmMmI5IiwiZXhwIjoyNzA4NTA2MTUyLCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.B2nk74W7BE2xyWMWBgqWvveliUmk3yAD8rc6NwRl6fA';

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
    getAll: '/Inventory/ItemCategoryMaster/GetAll',
    delete: '/Inventory/ItemCategoryMaster/Delete',
  },
  // Add more masters here as needed...
};

// ✅ Read master name from CLI (e.g., `--project="StateMaster"`)
const masterName = 'StateMaster';

test.describe(`Delete Data By API`, () => {
  test(`Delete all records from StateMaster`, async ({ request }) => {
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
    const allData = await getResponse.json();

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
