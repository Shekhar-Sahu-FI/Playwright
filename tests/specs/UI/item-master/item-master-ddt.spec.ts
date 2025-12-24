import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { ItemMaster } from '../../../../pages/master/item-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { FormOperation } from '../../../../utils/form-operation';
import * as XLSX from 'xlsx';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let itemMasterPage: ItemMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

const authFile = 'playwright/.auth/state.json';
test.use({ storageState: authFile });

// --- Read Excel ---
const workbook = XLSX.readFile('test-data/DDT/Masters.xlsx');
// Assuming the sheet name is 'Item' or 'Item Master'
const sheetName = workbook.SheetNames.find(n => n.trim() === 'Item' || n.includes('Item Master')) || 'Item';
const sheet = workbook.Sheets[sheetName];
const rows: any[] = XLSX.utils.sheet_to_json(sheet, { range: 0 });

// ---------------- TEST SUITE ----------------

test.describe('Add data using excel in Item Master', () => {
  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    // Navigate to Item Master
    // Confirming exact URL path from previous conversations or inferring logic. 
    // Usually likely 'master/item-master' based on folder structure.
    const newPath = 'master/item-master';
    const url = page.url().replace('dashboard', newPath);
    await page.goto(url);

    itemMasterPage = new ItemMaster(page);

    formLayout = new FormLayout(page);

    formOperation = new FormOperation(page, formLayout, SaveData, itemMasterPage);
  });

  test(`item save using excel`, async ({ page }) => {
    test.setTimeout(0); // remove global timeout

    await formOperation.openNewForm();

    for (let i = 0; i < rows.length; i++) {
      await test.step(`Row Index : ${i + 1}`, async () => {
        console.log('=================>', rows[i]);
        try {
          await Promise.race([
            SaveData(page, {
              code: rows[i]['Item Code'] || rows[i]['Code'],
              name: rows[i]['Item Name'] || rows[i]['Name'],
              subgroup: rows[i]['Subgroup'] || rows[i]['Sub Group'],
              unit: rows[i]['Unit'],
              status: rows[i]['Inactive'] ? '2' : '1',
              statusRemarks: 'Auto-imported',
              // Add other fields if present in Excel and supported by POM
            }),

            // per-iteration timeout
            new Promise((_, reject) => setTimeout(() => reject(new Error('Iteration Timeout Exceeded')), 15000)),
          ]);

          console.log(`✔ Entry ${i + 1} saved successfully`);
          await page.waitForTimeout(1500);
        } catch (err) {
          console.error(`✖ Entry ${i + 1} ${rows[i]['Item Name']} failed`);
          console.error(err);

          await formLayout.clickOkIfVisible();
          console.log('Clicked OK if visible');
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
  console.log('Data to be saved:', data);

  await test.step('Fill the form', async () => {
    await itemMasterPage.fillCode(data.code);
    await itemMasterPage.fillItemName(data.name);
    
    // Using value as query for auto-suggestions
    await itemMasterPage.fillSubgroup(data.subgroup, data.subgroup);
    await itemMasterPage.fillUnit(data.unit, data.unit);

    if (data.status) await itemMasterPage.selectStatusNo(data.status);
    if (data.status === '2') await itemMasterPage.fillStatusRemarks(data.statusRemarks);
  });

  await formLayout.clickSave();
  await formLayout.clickYes();

  const toast = page.locator('.z-toast');
  await toast.waitFor({ state: 'visible', timeout: 15000 });
  await toast.locator('button').click();
  await toast.waitFor({ state: 'hidden', timeout: 5000 });
};
