import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { CategoryMaster } from "../../../../pages/category-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let categoryMasterPage: CategoryMaster;
let formLayout: FormLayout;
let formHelper : FormHelper;

test.describe("Category Master Tests", () => {
  const testData = loadTestData("test-data/ui/category-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    await homePage.geToMaster('master', "Material Information","Item Category Master");

    categoryMasterPage = new CategoryMaster(page);
    await categoryMasterPage.isCategoryMasterPage();
    await expect(page).toHaveURL(/.*category-master/);

     formHelper = new FormHelper(page,formLayout,SaveData,categoryMasterPage );
  });

  test("New category creation 1 @saveCategotyNew1", async ({ page }) => {
     await formHelper.saveAndVerify(testData.save1)
  });

  test("New category creation 2 @saveNew2", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save2)
  });

  test("Check Validation Error @validationError", async ({ page }) => {
    await formHelper.checkValidationError(
    [ "Enter Code","Enter Item Category Name","Enter Status Remarks"]
    )
  });

  test("Delete Category Saved Data @deleteData", async ({ page }) => {
   await formHelper.deleteAndVerify(testData.delete, testData.delete.code)

  });

  test("Duplicate Data Validation @duplicateCCValidation", async ({ page }) => {
    await formHelper.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
      await categoryMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @updateCategoryData", async ({ page }) => {
       await formHelper.updateData(testData.update, testData.update.firstSave.name)
  });
});

const SaveData = async (page: Page, data: any,  mode: "save" | "update" | "" = "") => {
  
  await test.step("Fill the form", async () => {
    await categoryMasterPage.fillCode(data.code);
    await categoryMasterPage.fillCategoryName(data.name);
    if (data.status) {
      await categoryMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await categoryMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

 if(mode){
  await test.step("Save and verify", async () => {
    await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*category-master/);
      const row = categoryMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
  });
}
};
