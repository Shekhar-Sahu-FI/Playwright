import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { DepartmentMaster } from "../../../../pages/department-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { TreeCheckboxTester } from "../../../../utils/tree-component";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let departmentMasterPage: DepartmentMaster;
let formLayout: FormLayout;
let treeCheckboxTester: TreeCheckboxTester;
let formHelper: FormHelper;

test.describe("Department Master Tests", () => {
  const testData = loadTestData("test-data/ui/department-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);
    treeCheckboxTester = new TreeCheckboxTester(page, "Jaguar");

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch("PDPT");

    departmentMasterPage = new DepartmentMaster(page);
    await departmentMasterPage.isDepartmentMasterPage();
    await expect(page).toHaveURL(/.*department-master/);
    formHelper = new FormHelper(page, formLayout, SaveData, departmentMasterPage);
  });

  test("save 1 New Department creation @saveNewDepartment", async ({
    page,
  }) => {
    await formHelper.saveAndVerify(testData.save1)
  });

  test("Save 2 Department creation @saveNewDepartment2", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save2)
  });

  test("Check Validation Error @departmentValidationError", async ({
    page,
  }) => {
     await formHelper.checkValidationError(
    ["Enter Code", "Enter Department Name","Enter Status Remarks", "Select at least one Business Unit."])
  });

  test("Delete Saved Data @departmentDeleteData", async ({ page }) => {
        await formHelper.deleteAndVerify(testData.delete, testData.delete.code)

   
  });

  // test('Test Tree Component @treeComponent', async({page})=>{

  //         await test.step('Open new form', async () => {
  //             await formLayout.clickAdd();
  //             await expect(page).toHaveURL(/.*new/);
  //         });
  //         await treeCheckboxTester.checkParentChecksAllChildren();
  //         await treeCheckboxTester.uncheckParentUnchecksAllChildren();
  //         await treeCheckboxTester.uncheckOneChildUnchecksParent();
  //         await treeCheckboxTester.checkAllChildrenCheckParent();
  //         await treeCheckboxTester.uncheckAll();
  // })

  test("Duplicate Data Validation @departmentDuplicateValidation", async ({
    page,
  }) => {
    await formHelper.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } =
    await departmentMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test("Update Saved Data @departmentUpdateData", async ({ page }) => {
    formHelper.updateData(testData.update, testData.firstSave.code)
  });
});

const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  await test.step("Fill the form", async () => {
    await departmentMasterPage.fillCode(data.code);
    await departmentMasterPage.fillDepartmentName(data.name);
    await departmentMasterPage.selectBusinessUnit(data.businessUnit1);
    if (data.status) {
      await departmentMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await departmentMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*department-master/);
      const row = departmentMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
