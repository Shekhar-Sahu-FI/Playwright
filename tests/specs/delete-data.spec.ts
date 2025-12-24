import { test, expect, request as playwrightRequest } from '@playwright/test';
import { WarehouseMaster } from '../../pages/master/warehouse-master';

const baseURL = 'https://stageapi.arpaerp.com/api';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwidGVuYW50Tm8iOiIxNCIsInVzZXJQcm9maWxlSWQiOiJBZG1pbiIsInVzZXJJZCI6IjMxIiwic2Vzc2lvbklkIjoiMzFkZWMzOGQtNTM3Yi00NWNhLThmNGYtNjkwMjkyZWUxYThlIiwic3ViIjoiemVwaXR5eG9AZm9yZXh6aWcuY29tIiwianRpIjoiNzAxMGQ4NjYtMjViNC00MzE1LWJlNWYtOTE2N2M3OTI1NmMyIiwiZXhwIjoxNzY2NDA5MDQ5LCJpc3MiOiJhcnBhZXJwLmNvbSIsImF1ZCI6ImFycGFlcnAuY29tIn0.4ONoAm2qw83e2viHzABjK1zPE7M3-iENcu3RF-DoiPU';
const masterEndpoints = {
  StateMaster: {
    getAll: '/GlobalData/StateMaster/GetAll',
    delete: '/GlobalData/StateMaster/Delete',
  },
  DepartmentMaster: {
    getAll: '/Master/DepartmentMaster/GetAll',
    delete: '/Master/DepartmentMaster/Delete',
  },
  WarehouseMaster: {
    getAll: '/Master/WarehouseMaster/GetAll',
    delete: '/Master/WarehouseMaster/Delete',
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
const masterName = 'DepartmentMaster';

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
