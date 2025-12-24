import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { WarehouseMaster } from '../../../../pages/master/warehouse-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let warehouseMasterPage: WarehouseMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Warehoues Master Tests', () => {
  const testData = loadTestData('test-data/ui/master/warehouse-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch('MMWH');

    warehouseMasterPage = new WarehouseMaster(page);
    await warehouseMasterPage.isWarehouseMasterPage();
    await expect(page).toHaveURL(/.*warehouse-master/);
    formOperation = new FormOperation(page, formLayout, SaveData, warehouseMasterPage);
  });

  test('save 1 New Warehouse creation @saveNewWarehouse', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test('Save 2 Warehouse creation @saveNewWarehouse2', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test('Check Validation Error @warehouesValidationError', async ({ page }) => {
    await formOperation.checkValidationError(['Enter Code', 'Enter Warehouse Name', 'Enter Status Remarks']);
  });

  test('Delete Saved Data @warehoueDeleteData', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code);
  });

  // test('Test Tree Component @treeComponent', async({page})=>{

  //         await test.step('Open new form', async () => {
  //             await formLayout.clickAdd();
  //             await expect(page).toHaveURL(/.*new/);
  //         });
  //
  // })

  test('Duplicate Data Validation @warehouseDuplicateValidation', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } = await warehouseMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test('Update Saved Data @warehouseUpdateData', async ({ page }) => {
    formOperation.updateData(testData.update, testData.firstSave.code);
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await warehouseMasterPage.fillCode(data.code);
    await warehouseMasterPage.fillWarehouseName(data.name);
    await warehouseMasterPage.selectBusinessUnit(data.businessUnit1);
    await warehouseMasterPage.checkSubgroup(data.subgroups);
    if (data.status) {
      await warehouseMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await warehouseMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      const row = warehouseMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
