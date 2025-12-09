import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login';
import { TestConfig } from '../../../../test.config';
import { CategoryMaster } from '../../../../pages/category-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let categoryMasterPage: CategoryMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Category Master Full UI Tests', () => {
  const testData = loadTestData('test-data/ui/category-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    // await homePage.geToMaster('master', "Material Information", "Item Category Master");

    await page.locator('[name="hamburger"]').click();
    await page
      .locator('div')
      .filter({ hasText: /^Master$/ })
      .click();
    await page.locator('li:nth-child(1) > .relative > .flex.flex-row').hover();
    await page.getByRole('link', { name: 'Item Category Master' }).click();

    categoryMasterPage = new CategoryMaster(page);
    await categoryMasterPage.isCategoryMasterPage();
    await expect(page).toHaveURL(/.*category-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, categoryMasterPage);
  });

  test('New category creation 1 @saveCategotyNew1', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test('New category creation 2 @saveNew2', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2);
  });

  test('Check Validation Error @validationError', async ({ page }) => {
    await formOperation.checkValidationError(['Enter Code', 'Enter Item Category Name', 'Enter Status Remarks']);
  });

  test('Delete Category Saved Data @deleteData', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code);
  });

  test('Duplicate Data Validation @duplicateCCValidation', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } = await categoryMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test('Update Saved Data @updateCategoryData', async ({ page }) => {
    await formOperation.updateData(testData.update, testData.update.firstSave.name);
  });
});

// test.describe('Add data using excel in Category Master', () => {
//   const testData = loadTestData('test-data/ui/category-master-data.json');
//   test.beforeEach(async ({ page }) => {
//     config = new TestConfig();
//     await page.goto(config.appUrl);

//     loginPage = new LoginPage(page);
//     await loginPage.login(config.email, config.password);

//     formLayout = new FormLayout(page);

//     homePage = new HomePage(page);
//     await homePage.isHomePage();

//     // await homePage.geToMaster('master', "Material Information", "Item Category Master");

//     const newPath = 'master/item-category-master';
//     const url = page.url().replace('dashboard', newPath);
//     await page.goto(url);

//     categoryMasterPage = new CategoryMaster(page);
//     await categoryMasterPage.isCategoryMasterPage();
//     await expect(page).toHaveURL(/.*category-master/);

//     formOperation = new FormOperation(page, formLayout, SaveData, categoryMasterPage);
//   });
//   test('New category creation 1 @saveCategotyNew132131', async ({ page }) => {
//     await formOperation.saveAndVerify(testData.save1);
//   });
// });

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    console.log('Data from function call============', data);
    await categoryMasterPage.fillCode(data.code);
    await categoryMasterPage.fillCategoryName(data.name);
    if (data.status) {
      await categoryMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await categoryMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*category-master/);
      const row = categoryMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
    });
  }
};
