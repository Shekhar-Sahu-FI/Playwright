import { APIRequestContext, expect } from '@playwright/test';
import { login } from '../../utils/auth';

const baseURL = 'https://stageapi.arpaerp.com/api';

const endpoints: Record<string, any> = {
  StateMaster: {
    Search: '/GlobalData/StateMaster/Search',
    delete: '/GlobalData/StateMaster/Delete',
  },
  DepartmentMaster: {
    Search: '/Master/DepartmentMaster/Search',
    delete: '/Master/DepartmentMaster/Delete',
  },
  WarehouseMaster: {
    Search: '/Master/WarehouseMaster/Search',
    delete: '/Master/WarehouseMaster/Delete',
  },
  ItemCategoryMaster: {
    Search: '/Master/ItemCategoryMaster/Search',
    delete: '/master/ItemCategoryMaster/Delete',
  },
  ItemGroupMaster: {
    Search: '/Master/ItemGroupMaster/Search',
    delete: '/Master/ItemGroupMaster/Delete',
  },
  UnitMaster: {
    Search: '/Master/UnitMaster/Search',
    delete: '/Master/UnitMaster/Delete',
  },
   ItemMaster: {
    Search: '/Master/ItemMaster/Search',
    delete: '/master/ItemMaster/Delete',
  },
};

export async function deleteSavedData(
  request: APIRequestContext,
  formName: keyof typeof endpoints,
  fieldName: string,
  fieldValue: any,
) {
  const masterConfig = endpoints[formName];
  if (!masterConfig) {
    throw new Error(`No endpoint configuration found for master: ${formName}`);
  }

  const token = await login();

  const SearchResponse = await request.get(
    `${baseURL}${masterConfig.Search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  expect(SearchResponse.ok()).toBeTruthy();

  const body = await SearchResponse.json();
  const record = body.data.find(
    (item: any) => item[fieldName] === fieldValue
  );

  if (!record) {
    console.log(`No record found for ${fieldName} = ${fieldValue}`);
    return;
  }

  const delResponse = await request.delete(
    `${baseURL}${masterConfig.delete}/${record.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  expect(delResponse.ok()).toBeTruthy();
  console.log(`Deleted ${formName} → ID: ${record.id}`);
}
