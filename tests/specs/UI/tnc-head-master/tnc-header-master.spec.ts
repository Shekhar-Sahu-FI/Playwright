import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login';
import { TestConfig } from '../../../../test.config';
import { TnCMaster } from '../../../../pages/tnc-head-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let tncMasterPage: TnCMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Test TNC head Master', () => {
  const testData = loadTestData('test-data/ui/tnc-head-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    const newPath = 'master/tnc-head-master';
    const url = page.url().replace('dashboard', newPath);
    await page.goto(url);
    tncMasterPage = new TnCMaster(page);

    formOperation = new FormOperation(page, formLayout, SaveData, tncMasterPage);
  });

  test('Check tnc Form opening', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save);
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await tncMasterPage.fillTncHeadName(data.tncHeadName);
    if (data.status) {
      await tncMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await tncMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });
  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      const row = tncMasterPage.getRowByCode(data.tncHeadName);
      await expect(row).toHaveCount(1);
    });
  }
};
