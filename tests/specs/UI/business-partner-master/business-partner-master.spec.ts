import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { BusinessPartnerMaster } from '../../../../pages/master/business-partner-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let bpMasterPage: BusinessPartnerMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe('Business Partner Master Tests UI @BPUIFunctionality', () => {
  const testData = loadTestData('test-data/ui/master/bp-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    const newPath = 'master/business-partner-master';
    const url = page.url().replace('dashboard', newPath);
    await page.goto(url);

    bpMasterPage = new BusinessPartnerMaster(page);
    await expect(page).toHaveURL(/.*business-partner-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, bpMasterPage);
  });

  test('Testing Business Partner Master working', async ({ page }) => {
    await formOperation.saveAndVerify(testData);
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await bpMasterPage.fillBPName(data.bpName);
    await bpMasterPage.fillWebsite(data.website);
    await bpMasterPage.fillMsmeNo(data.msmeNo);
    await bpMasterPage.fillPrintingName(data.printingName);

    // Optional flags
    if (data.customer) await bpMasterPage.checkCustomer();
    if (data.supplier) await bpMasterPage.checkSupplier();
    if (data.transporter) await bpMasterPage.checkTransporter();

    // Status
    if (data.status) await bpMasterPage.selectStatusNo(data.status);
    if (data.status === '2') await bpMasterPage.fillStatusRemarks(data.statusRemarks);

    // Location modal
    if (data.locationDetail) {
      await bpMasterPage.fillLocationForm(data.locationDetail);
    }

    // Contact Person modal
    if (data.contactPersonDetail) {
      await bpMasterPage.fillContactPersonForm(data.contactPersonDetail);
    }
  });
  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*master\/business-partner-master/);
      const row = bpMasterPage.getRowByCode(data.bpName);
      await expect(row).toHaveCount(1);
    });
  }
};
