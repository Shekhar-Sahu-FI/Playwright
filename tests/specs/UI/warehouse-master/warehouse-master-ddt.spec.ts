import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login';
import { TestConfig } from '../../../../test.config';
import { WarehouseMaster } from '../../../../pages/warehouse-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { FormOperation } from '../../../../utils/form-operation';
import * as XLSX from 'xlsx';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let warehouseMasterPage: WarehouseMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

const authFile = 'playwright/.auth/state.json';
test.use({ storageState: authFile });

// --- Read Excel ---
const workbook = XLSX.readFile('test-data/DDT/Masters.xlsx');
const sheet = workbook.Sheets['Warehouse'];
const rows: any[] = XLSX.utils.sheet_to_json(sheet, { range: 0 });

// ---------------- TEST SUITE ----------------

test.describe('Add data using excel in Warehouse Master', () => {
  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    const newPath = 'master/warehouse-master';
    const url = page.url().replace('dashboard', newPath);
    await page.goto(url);

    warehouseMasterPage = new WarehouseMaster(page);

    formLayout = new FormLayout(page);

    formOperation = new FormOperation(page, formLayout, SaveData, warehouseMasterPage);
  });

  test(`warehouse save using excel`, async ({ page }) => {
    test.setTimeout(0); // remove global timeout

    await formOperation.openNewForm();

    for (let i = 0; i < rows.length; i++) {
      await test.step(`Row Index : ${i + 1}`, async () => {
        try {
          await Promise.race([
            SaveData(page, {
              code: rows[i]['Code'],
              name: rows[i]['WarehouseName'],
              status: rows[i]['Inactive'] ? '2' : '1',
              buDetail: ['Godawari'],
              statusRemarks: 'Auto-imported',
            }),

            // per-iteration timeout
            new Promise((_, reject) => setTimeout(() => reject(new Error('Iteration Timeout Exceeded')), 10000)),
          ]);

          console.log(`✔ Entry ${i + 1} saved successfully`);
          await page.waitForTimeout(1500);
        } catch (err) {
          console.error(`✖ Entry ${i + 1} failed`);
          console.error(err);

          await formLayout.clickOkIfVisible();
          await formLayout.clickCancelIfVisible();
          await formOperation.openNewForm();

          test.info().attach(`Error Row ${i + 1}`, {
            body: String(err),
          });

          // Do not throw, continue to next iteration
        }
      });
    }
  });
});

// ---------------- REUSABLE SAVE FUNCTION ----------------
const SaveData = async (page: Page, data: any) => {
  await test.step('Fill the form', async () => {
    await warehouseMasterPage.fillCode(data.code);
    await warehouseMasterPage.fillWarehouseName(data.name);
    await warehouseMasterPage.selectBusinessUnit(data.buDetail);
    if (data.status) await warehouseMasterPage.selectStatusNo(data.status);
    if (data.status === '2') await warehouseMasterPage.fillStatusRemarks(data.statusRemarks);
  });

  await formLayout.clickSave();
  await formLayout.clickYes();

  const toast = page.locator('.z-toast');

  if (await toast.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null)) {
    await toast.locator('button').click();
    return;
  }
};
