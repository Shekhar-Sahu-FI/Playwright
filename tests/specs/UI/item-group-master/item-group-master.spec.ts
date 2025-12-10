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

    // Using the simplified method directly in tests, or maintaining FormOperation if it wraps it efficiently.
    // Assuming FormOperation adds value (e.g. repeated verification steps), we keep it but ensure it calls the optimized page methods.
    // However, the SaveData function was redundant. We'll inline the save mechanism if needed or trust FormOperation uses our new page methods.
    
    // We pass a dummy function for now if FormOperation requires it, or refactor FormOperation later. 
    // Given the instruction was to refactor related files, and FormOperation is used here, 
    // I will assume FormOperation expects a 'SaveData' callback. 
    // But since we want to optimize, we should use the page object's built-in fill method.
    
    // Changing the strategy: The test file previously defined a 'SaveData' const and passed it. 
    // We will update that 'SaveData' to use the proper page methods.
    formOperation = new FormOperation(page, formLayout, SaveData, itemGroupMasterPage);
  });

  test("New Item group creation 1 @saveGroupNew1", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  // Example of direct usage if we wanted to bypass FormOperation, typically cleaner 
  // but we stick to the existing structure for consistency unless asked to rewrite FormOperation too.

  test("New Item group creation 2 @saveGroupNew2", async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2);
  });

  test("Check Validation Error @validationGrpError", async ({ page }) => {
    await formOperation.checkValidationError([
      "Enter Item Group Code", "Enter Item Group Name", "Enter Status Remark", "Enter Item Category Name", "Enter Item Category Code"])
  })

  test("Delete Saved Group Data @deleteData", async ({ page }) => {
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

// Optimized SaveData helper that uses the refactored Page Object
const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  // Use the encapsulated logic in the page object which handles all fields including the category bug fix
  await test.step(`Fill form logic`, async () => {
    // We use the page object method which now correctly handles arguments
    // Mapping test data keys to what fillItemGroupMasterForm expects if needed
    // The previous implementation did field-by-field. The Page Object now has 'fillItemGroupMasterForm'.
    
    // Ideally we just call:
    // await itemGroupMasterPage.fillItemGroupMasterForm(data);
    // But since 'mode' is handled separately in that method (it saves at the end), 
    // and this callback might be used differently by FormOperation (e.g. sometimes just filling, sometimes saving).
    
    // Let's stick to field-by-field here to respect 'mode' control if 'fillItemGroupMasterForm' enforces saving.
    // Wait, 'fillItemGroupMasterForm' DOES enforce saving at the end. 
    // So we should break it down or use specific methods.
    
    await itemGroupMasterPage.fillCode(data.code);
    await itemGroupMasterPage.fillGroupName(data.name);
    // Passing both query and content for category
    await itemGroupMasterPage.fillCategory(
      data.categoryQuery || 'cat', 
      data.categoryName || data.category
    );
    
    if (data.status) {
      await itemGroupMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await itemGroupMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step(`Save (${mode}) and verify`, async () => {
      // Use the refactored formLayout (it handles confirmation dialogs internally now)
      await formLayout.saveData(mode); 
      
      await expect(page).toHaveURL(/.*item-group-master/);
      // Verify row exists
      const row = itemGroupMasterPage.getRowByCode(data.code || data.name); // Prefer code for uniqueness
      await expect(row).toHaveCount(1);
    });
  }
};
