import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { UnitMaster } from "../../../../pages/unit-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormOperation } from "../../../../utils/form-operation";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let unitMasterPage: UnitMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe("Unit Master Full UI Tests @testUnitMaster", () => {
  const testData = loadTestData("test-data/ui/unit-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch("MMUM");

    unitMasterPage = new UnitMaster(page);
    await unitMasterPage.isUnitMasterPage();
    await expect(page).toHaveURL(/.*unit-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, unitMasterPage);
  });

  test("New Unit creation 1 @saveUnitNew1", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1)
  });

  test("New Unit creation 2 @saveNew2", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2);
  });

  test("New Unit creation Test 3", async ({ page }) => {
    await formOperation.saveAndVerify(testData.test);
  });

  test("Check Validation Error @validationUnitError", async ({ page }) => {
    await formOperation.checkValidationError(
      ["Enter Code.", "Enter Unit Name.", "Enter Status Remarks."]
    );
  });

  test("Delete Saved Data @deleteUnitData", async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code)
  });

  test("Duplicate Data Validation @duplicateUnit", async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } = await unitMasterPage.getErrorStates();
    console.log(codeErrorVisible, nameErrorVisible, "<=====");
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @updateUnitData", async ({ page }) => {
    await formOperation.updateData(testData.update, testData.update.firstSave.code)
  });
});

const SaveData = async (page: Page, data: any, mode: "save" | "update" | "" = "") => {
  await test.step("Fill the form", async () => {
    await unitMasterPage.fillCode(data.code);
    await unitMasterPage.fillUnitName(data.name);
    if (data.status) {
      await unitMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await unitMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*unit-master/);
      const row = unitMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
