import { Page, test, expect, request as playwrightRequest } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { ItemMaster } from '../../../../pages/master/item-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';
import { deleteSavedData } from '../../delete-saved-test-data';

import { PurchaseRequest } from '../../../../pages/inventory/purchase-request';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let itemMasterPage: ItemMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Item Master Tests', () => {
  const testData = loadTestData('test-data/ui/master/item-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch('MMMM');

    itemMasterPage = new ItemMaster(page);
    await expect(page).toHaveURL(/.*item-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, itemMasterPage);
  });

  test('New Item creation 1 @saveWithAllData', async ({ page, request }) => {
    await formOperation.saveAndVerify(testData.saveWithAllData, request);
  });

  test('Item with mandatory only', async ({ page, request }) => {
    await formOperation.saveAndVerify(testData.saveWithMandatoryData, request);
  });

  test('Item with maximum Characters', async ({ page, request }) => {
    await formOperation.saveAndVerify(testData.saveWithMaxChar, request);
  });

  test('Item with only mandatory', async ({ page, request }) => {
    await formOperation.saveAndVerify(testData.saveWithMandatoryData, request);
  });

  test('Mandatory Validation For Item', async ({ page }) => {
    await formOperation.checkValidationError([
      'Select a Subgroup.',
      'Enter Item Name.',
      'Enter Item Code.',
      'Select a Unit.',
      'Enter Status Remarks.',
    ]);
  });

  test('Item Save And Update', async ({ page }) => {
    await formOperation.updateData(testData.saveAndUpdate, testData.saveAndUpdate.firstSave.itemName);
  });

  test('Delete Saved Item In Item Master', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.saveAndDelete, testData.saveAndDelete.itemName);
  });

  test('Test Purchase Request', async ({ page }) => {

    await page.waitForTimeout(5000);

    await homePage.goToForm("Inventory", "Inventory Transaction", "Purchase Request", page);
    await formOperation.openNewForm();
    const PR = new PurchaseRequest(page);
    // await PR.selectDocDate("2025-06-26")
    await PR.fillSchedule();
  });

  // test("Check Item Subgroup Field Parameters", async ({ page }) => {
  //     await formOperation.openNewForm();
  //     await itemMasterPage.checkFieldParameter();
  // });

  test('Duplicate Item  Validation', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicateError);

    const { codeErrorVisible, itemCodeErrorVisible, itemNameErrorVisible } = await itemMasterPage.getErrorStates();
    console.log(codeErrorVisible, itemCodeErrorVisible, itemNameErrorVisible);

    expect(codeErrorVisible).toBeTruthy();
    expect(itemCodeErrorVisible).toBeTruthy();
    expect(itemNameErrorVisible).toBeTruthy();
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '', deleteData: boolean = true, request: any) => {
  await test.step('Fill the form', async () => {
    await itemMasterPage.fillCode(data.itemCode);
    await itemMasterPage.fillItemName(data.itemName);
    await itemMasterPage.fillSubgroup(data.itemSubgroupQuery, data.itemSubgroupName);
    await itemMasterPage.fillUnit(data.unitQuery, data.unitName);
    await itemMasterPage.selectStockValuationMethodNo(data.stockValuationMethodNo || '');

    if (data.leadTime) {
      await itemMasterPage.fillLeadTime(data.leadTime);
    }
    if (data.remarks) {
      await itemMasterPage.fillRemarks(data.remarks || '');
    }

    if (data.isMaintainDimension) {
      await itemMasterPage.selectIsMaintainDimension();
      await itemMasterPage.selectDimensionIn(data.dimensionIn);
      await itemMasterPage.fillDimensionUnit(data.dimensionUnitQuery, data.dimensionUnitName);
      await itemMasterPage.fillStandardWt(data.standardWt);
    }

    if (data.isMaintainBatchAndExpiry) {
      await itemMasterPage.selectIsMaintainBatchAndExpiry();
    }

    if (data.makeManagementTypeNo == 3 || data.makeManagementTypeNo == 2) {
      await itemMasterPage.selectMakeManagementTypeNo(data.makeManagementTypeNo);
    }

    if (data.makeManagementTypeNo == 3) {
      console.log('makeMaknagement Is running');
      for (let i = 0; i < data.itemMasterMakeDetail.length; i++) {
        const { query, makeName } = data.itemMasterMakeDetail[i];
        await itemMasterPage.fillMake(query, makeName, i);
      }
    }
    if (data.itemMasterWarehouseDetail?.length > 0) {
      for (let i = 0; i < data.itemMasterWarehouseDetail.length; i++) {
        const { query, warehouseName, reorderLevel, reorderQty } = data.itemMasterWarehouseDetail[i];
        await itemMasterPage.fillWarehouse(query, warehouseName, i);
        await itemMasterPage.fillReorderLevel(reorderLevel, i);
        await itemMasterPage.fillReorderQty(reorderQty, i);
      }
    }

    if (data.isUnitConversion) {
      await itemMasterPage.selectIsUnitConvertion();
      for (let i = 0; i < data.itemMasterUnitConvertionDetail.length; i++) {
        const {
          unitType,
          unitConvertionType,
          baseUnitValue,
          unitConvertionNameQuery,
          unitConvertionName,
          unitConvertionValue,
        } = data.itemMasterUnitConvertionDetail[i];
        await itemMasterPage.selectUnitType(unitType, i);
        await itemMasterPage.selectUnitConvertionType(unitConvertionType, i);
        await itemMasterPage.fillBaseUnitValue(baseUnitValue, i);
        await itemMasterPage.fillConvertionUnit(unitConvertionNameQuery, unitConvertionName, i);
        await itemMasterPage.fillConvertionUnitValue(unitConvertionValue, i);
      }
    }

    await itemMasterPage.selectStatusNo(data.status);
    if (data.statusRemarks) {
      await itemMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*item-master/);
      // const row = itemMasterPage.getRowByCode(data.itemName);
    });
  }
  if (deleteData) {
    await deleteSavedData(request, "ItemMaster", "itemName", data.itemName)
  }

};
