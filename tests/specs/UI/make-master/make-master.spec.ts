import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/admin/login";
import { TestConfig } from "../../../../test.config";
import { MakeMaster } from "../../../../pages/master/make-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormOperation } from "../../../../utils/form-operation";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let makeMasterPage: MakeMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe("Make Master Tests UI @MakeUiFunctionality", () => {
  const testData = loadTestData("test-data/ui/master/make-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch("MMMK");

    makeMasterPage = new MakeMaster(page);
    await makeMasterPage.isMakeMasterPage();
    await expect(page).toHaveURL(/.*make-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, makeMasterPage);
  });

  test("New Make creation 1 @saveNew1", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test("New Make creation 2 @saveNew2", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2);
  });

  test("Check Validation Error @validationError", async ({ page }) => {
    await formOperation.checkValidationError([
      "Enter Code.",
      "Enter Make Name.",
      "Enter Status Remarks.",
    ]);
  });

  test("Delete Saved Data @deleteData", async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code);
  });

  test("Duplicate Data Validation @duplicateValidation", async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
      await makeMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @UpdateMakeData", async ({ page }) => {
    await formOperation.updateData(
      testData.update,
      testData.update.firstSave.code
    );
  });

});

const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  await test.step("Fill the form", async () => {
    await makeMasterPage.fillCode(data.code);
    await makeMasterPage.fillMakeName(data.name);
    if (data.status) {
      await makeMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await makeMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });
  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*make-master/);
      const row = makeMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
    });
  }
};
