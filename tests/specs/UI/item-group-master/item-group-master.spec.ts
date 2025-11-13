import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { ItemGroupMaster } from "../../../../pages/item-group-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormOperation } from "../../../../utils/form-operation";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let itemGroupMasterPage: ItemGroupMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

test.describe("Item group Master Tests", () => {
  const testData = loadTestData("test-data/ui/item-group-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    await homePage.masterSearch("MMMG");

    itemGroupMasterPage = new ItemGroupMaster(page);
    await itemGroupMasterPage.isItemGroupMasterPage();
    await expect(page).toHaveURL(/.*item-group-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, itemGroupMasterPage);
  });

  test("New Item group creation 1 @saveGroupNew1", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1)
  });

  test("New Item group creation 2 @saveGroupNew2", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2)
  });

  test("Check Validation Error @validationGrpError", async ({ page }) => {
    await formOperation.checkValidationError([
      "Enter Item Group Code", "Enter Item Group Name", "Enter Status Remark", "Enter Item Category Name", "Enter Item Category Code"])
  })

  test("Delete Saved Group Data @deleteData", async ({ page }) => {
    console.log("Deleting the data", testData.delete);
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code)

  });

  test("Duplicate Data Validation @duplicateGrpValidation", async ({
    page,
  }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
      await itemGroupMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @updategroupData", async ({ page }) => {
    formOperation.updateData(testData.update, testData.firstSave.code)
  });
});

const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  await test.step("Fill the form", async () => {
    await itemGroupMasterPage.fillCode(data.code);
    await itemGroupMasterPage.fillGroupName(data.name);
    await itemGroupMasterPage.fillCategory(
      data.categoryQuery,
      data.categoryName
    );
    if (data.status) {
      await itemGroupMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await itemGroupMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*item-group-master/);
      const row = itemGroupMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
    });
  }
};
