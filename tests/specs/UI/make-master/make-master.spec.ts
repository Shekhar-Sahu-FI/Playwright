import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { MakeMaster } from "../../../../pages/make-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let makeMasterPage: MakeMaster;
let formLayout: FormLayout;
let formHelper: FormHelper;

test.describe("Make Master Tests UI @MakeUiFunctionality", () => {
  const testData = loadTestData("test-data/ui/make-master-data.json");

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

    formHelper = new FormHelper(page, formLayout, SaveData, makeMasterPage);
  });

  test("New Make creation 1 @saveNew1", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save1);
  });

  test("New Make creation 2 @saveNew2", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save2);
  });

  test("Check Validation Error @validationError", async ({ page }) => {
    await formHelper.checkValidationError([
      "Enter Code.",
      "Enter Make Name.",
      "Enter Status Remarks.",
    ]);
  });

  test("Delete Saved Data @deleteData", async ({ page }) => {
    await formHelper.deleteAndVerify(testData.delete, testData.delete.code);
  });

  test("Duplicate Data Validation @duplicateValidation", async ({ page }) => {
    await formHelper.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
      await makeMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @UpdateMakeData", async ({ page }) => {
    await formHelper.updateData(
      testData.update,
      testData.update.firstSave.code
    );
  });

  // test.only("testing Row Index", async ({ page }) => {
  //   const row = page.locator('[id="TestingIfForTableRow1"]');
  //   await page.waitForTimeout(3000);
  //   const count = await row.count();
  //   console.log(count);

  //   const count5 = await row.count();
  //   console.log(count5);
  //   for (let i = 0; i < count5; i++) {
  //     const nameCell = await row.nth(i).locator("td").nth(1).textContent();
  //     const codeCell = await row.nth(i).locator("td").nth(2).textContent();
  //     const text = await row.nth(i).innerText();
  //     console.log("name", nameCell);
  //     console.log("code" , codeCell);
  //   }
    
  //   await row.nth(0).locator("td").nth(0).click()
  //     await page.waitForTimeout(5000);
  // });
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
