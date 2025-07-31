import { test, Page, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { CostCenterMaster } from "../../../../pages/cost-center-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let costCenterMasterPage: CostCenterMaster;
let formLayout: FormLayout;
let formHelper: FormHelper;

test.describe("Cost Center Master Tests", () => {
  const testData = loadTestData("test-data/ui/cost-center-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);
    homePage = new HomePage(page);

    await homePage.isHomePage();
    await homePage.masterSearch("CCCM");

    costCenterMasterPage = new CostCenterMaster(page);
    await costCenterMasterPage.isCostCenterMasterPage();
    await expect(page).toHaveURL(/.*cost-center-master/);
    formHelper = new FormHelper(
      page,
      formLayout,
      SaveData,
      costCenterMasterPage
    );
  });

  test("Create new cost center @saveCCNew", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save1);
  });

  test("Create new cost center @saveCCNew2", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save2);
  });

  test("Delete cost center data @deleteCCData", async ({ page }) => {
    await formHelper.deleteAndVerify(testData.delete, testData.delete.code);
  });

  test("Form validation errors @CCValidationError", async ({ page }) => {
    await formHelper.checkValidationError([
      "Enter Code",
      "Enter Cost Center Name",
      "Enter Business Unit Name",
      "Enter Status Remarks",
    ]);
  });

  test("Duplicate cost center validation @CCDuplicateValidation", async ({
    page,
  }) => {
    await formHelper.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
      await costCenterMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update existing cost center @updateCC", async ({ page }) => {
    await formHelper.updateData(testData.update, testData.update.firstSave.name);
  });
});

const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  await test.step("Fill the form", async () => {
    await costCenterMasterPage.fillBusinessUnit(
      data.businessUnitQuery,
      data.businessUnitName
    );
    await costCenterMasterPage.fillCode(data.code);
    await costCenterMasterPage.fillCostCenterName(data.name);
    await costCenterMasterPage.fillParentCostCenter(
      data.parentQuery,
      data.parentCostCenterName
    );
    await costCenterMasterPage.fillDescription(data.description);
    await costCenterMasterPage.selectStatusNo(data.status);
    await costCenterMasterPage.fillStatusRemarks(data.statusRemarks);
  });

  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);

      await expect(page).toHaveURL(/.*cost-center-master/);
      const row = costCenterMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
