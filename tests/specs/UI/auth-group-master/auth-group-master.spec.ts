import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { AuthGroupMaster } from '../../../../pages/master/auth-group-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let authGroupMasterPage: AuthGroupMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Auth Group Master Tests UI @AuthGroupUiFunctionality', () => {
  const testData = loadTestData('test-data/ui/master/auth-group-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    const newPath = 'master/authorization-group-master';
    const url = page.url().replace('dashboard', newPath);
    await page.goto(url);

    authGroupMasterPage = new AuthGroupMaster(page);
    await authGroupMasterPage.isAuthGroupMasterPage();
    await expect(page).toHaveURL(/.*authorization-group-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, authGroupMasterPage);
  });

  test('Testing Authgorup Master working', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save);
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await authGroupMasterPage.fillAuthGroupName(data.authGroupName);
    await authGroupMasterPage.fillDescription(data.description);
    await authGroupMasterPage.fillApproverDetail(data.approverDetail);
    if (data.status) {
      await authGroupMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await authGroupMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });
  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*authorization-group-master/);
      const row = authGroupMasterPage.getRowByCode(data.authGroupName);
      await expect(row).toHaveCount(1);
    });
  }
};
