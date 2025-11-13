import { Page, test, expect } from '@playwright/test';
import { StateMaster } from '../../../../pages/state-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

const authFile = 'playwright/.auth/state.json';
const testData = loadTestData('test-data/ui/state-master-valid-save.json');

test.use({ storageState: authFile }); // ✅ Reuse login

let homePage: HomePage;
let stateMasterPage: StateMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Save Valid State Data', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    stateMasterPage = new StateMaster(page);
    formLayout = new FormLayout(page);
    formOperation = new FormOperation(page, formLayout, SaveData, stateMasterPage);
    await page.goto('http://localhost:5173/master/state-master');
  });

  for (const data of testData) {
    const key = Object.keys(data)[0];
    const value: any = Object.values(data)[0];
    test(`New State creation ${key} @${key}`, async ({ page }) => {
      await formOperation.saveAndVerify(value);
    });
  }
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await stateMasterPage.selectCountry(data.query, data.countryName);
    await stateMasterPage.fillCode(data.code);
    await stateMasterPage.fillStateName(data.name);
    if (data.status) {
      await stateMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await stateMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*state-master/);
      const row = stateMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
