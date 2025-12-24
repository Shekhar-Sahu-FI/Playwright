import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { UnitMaster } from '../../../../pages/master/unit-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';
import * as XLSX from 'xlsx';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let unitMasterPage: UnitMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

const workbook = XLSX.readFile('test-data/DDT/Unit_Master(Vakrangee).xlsx');
const sheet = workbook.Sheets['Sheet1'];
const rows: any[] = XLSX.utils.sheet_to_json(sheet, { range: 3 });

test.describe('Unit Master Save with excel', () => {
  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch('MMUM');

    unitMasterPage = new UnitMaster(page);
    await expect(page).toHaveURL(/.*unit-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, unitMasterPage);
  });

  test(`group save using excel`, async ({ page }) => {
    test.setTimeout(0); // prevent global test timeout

    await formOperation.openNewForm();

    for (let i = 0; i < rows.length; i++) {
      await test.step(`Row Index : ${i + 1} ${rows[i]['Unit Name']}`, async () => {
        try {
          // Apply per-iteration timeout protection
          await Promise.race([
            SaveData(page, {
              code: String(rows[i]['Alias']),
              name: rows[i]['Unit Name'].trim(),
              status: rows[i]['Inactive'] ? '2' : '1',
              statusRemarks: 'inactive',
            }),

            new Promise(
              (_, reject) => setTimeout(() => reject(new Error('Iteration Timeout Exceeded')), 10000), // 30 sec timeout
            ),
          ]);

          console.log(`✔ Entry ${i + 1} saved successfully`);
          await page.waitForTimeout(200);
        } catch (err) {
          console.error(`✖ Entry ${i + 1} failed`);
          await formLayout.clickOkIfVisible();
          await formLayout.clickCancelIfVisible();
          await formOperation.openNewForm();

          test.info().attach(`Error Row ${i + 1}`, {
            body: String(err),
          });
        }
      });
    }
  });
});

const SaveData = async (page: Page, data: any) => {
  await test.step('Fill the form', async () => {
    await unitMasterPage.fillCode(data.code);
    await unitMasterPage.fillUnitName(data.name);
    if (data.status) {
      await unitMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await unitMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  await formLayout.clickSave();
  await formLayout.clickYes();

  if (await page.getByText('Successfully  created.').isVisible()) {
    await page.waitForSelector('.z-toast');
    await page.locator('.z-toast button').click();
    return;
  } else {
    console.log(data.name, 'not saved.');
  }
};
