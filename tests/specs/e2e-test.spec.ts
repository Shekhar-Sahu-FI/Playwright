import { Page, test, expect } from "@playwright/test";
import { UnitMaster } from "../../pages/unit-master";
import { UserMaster } from "../../pages/user-master";
import { DepartmentMaster } from "../../pages/department-master";
import { CategoryMaster } from "../../pages/category-master";
import { CostCenterMaster } from "../../pages/cost-center-master";
import { WarehouseMaster } from "../../pages/warehouse-master";
import { MakeMaster } from "../../pages/make-master";
import { BusinessUnitMaster } from "../../pages/business-unit";
import { ItemGroupMaster } from "../../pages/item-group-master";
import { HomePage } from "../../pages/home";
import { FormLayout } from "../../utils/form-layout";
import { loadTestData } from "../../utils/data-provider";
import { LoginPage } from "../../pages/login";
import { TestConfig } from "../../test.config";
import { group } from "console";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let unitMasterPage: UnitMaster;
let costCenterMasterPage: CostCenterMaster;
let userMasterPage: UserMaster;
let makeMasterPage: MakeMaster;
let departmentMasterPage: DepartmentMaster;
let categoryMasterPage: CategoryMaster;
let itemGroupMasterPage: ItemGroupMaster;
let businessUnitMaster: BusinessUnitMaster;
let warehouseMasterPage: WarehouseMaster;
let formLayout: FormLayout;

test.describe("E2E Tests", () => {
  const testData = loadTestData("test-data/e2e-data.json");

  test("E2E Test @e2e", async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();

    await test.step("Add Unit", async () => {
      await homePage.masterSearch("MMUM");
      unitMasterPage = new UnitMaster(page);
      for (const unit of testData.unit) {
        await openNewForm(page);
        await unitMasterPage.fillUnitMasterForm(unit);
      }
    });

    await test.step("Add Make", async () => {
      await homePage.masterSearch("MMMK");
      makeMasterPage = new MakeMaster(page);
      for (const make of testData.make) {
        await openNewForm(page);
        await makeMasterPage.fillMakeMasterForm(make);
      }
    });

    await test.step("Add BusinessUnit", async () => {
      await homePage.clickAvatar();
      await homePage.clickOrganization();
      businessUnitMaster = new BusinessUnitMaster(page);
      for (const bu of testData.businessUnit) {
        await page.locator('[name="addBUbtn"]').click();
        await businessUnitMaster.fillData(bu, "save");
      }
    });

    await test.step("Add Category", async () => {
      await homePage.geToMaster(
        "master",
        "Material Information",
        "Item Category Master"
      );
      categoryMasterPage = new CategoryMaster(page);
      for (const category of testData.category) {
        await openNewForm(page);
        await categoryMasterPage.fillCategoryMasterForm(category);
      }
    });

    await test.step("Add Item Group", async () => {
      await homePage.geToMaster(
        "master",
        "Material Information",
        "Item group Master"
      );
      itemGroupMasterPage = new ItemGroupMaster(page);
      for (const group of testData.group) {
        await openNewForm(page);
        await itemGroupMasterPage.fillItemGroupMasterForm(group);
      }
    });

    await test.step("Add Cost Center", async () => {
      await homePage.masterSearch("CCCM");
      costCenterMasterPage = new CostCenterMaster(page);
      for (const costCenter of testData.costCenter) {
        await openNewForm(page);
        await costCenterMasterPage.fillCostCenterMasterForm(costCenter);
      }
    });

    await test.step("Add Department", async () => {
      await homePage.masterSearch("PDPT");
      departmentMasterPage = new DepartmentMaster(page);
      for (const department of testData.department) {
        await openNewForm(page);
        await departmentMasterPage.fillDepartmentMasterForm(department);
      }
    });

    await test.step("Add User", async () => {
      await homePage.geToMaster("master", "Other Masters", "User Master");
      userMasterPage = new UserMaster(page);
      for (const user of testData.user) {
        await openNewForm(page);
        await userMasterPage.fillUserMasterForm(user);
      }
    });

    await test.step("Add Warehouse", async () => {
      await homePage.geToMaster("master", "Other Masters", "Warehouse Master");
      warehouseMasterPage = new WarehouseMaster(page);
      for (const warehouse of testData.warehouse) {
        await openNewForm(page);
        await warehouseMasterPage.fillWarehouseMasterForm(warehouse);
      }
    });
  });

  const openNewForm = async (page: Page) => {
    await test.step("Open new form", async () => {
      await formLayout.clickAdd();
      await expect(page).toHaveURL(/.*new/);
    });
  };
});
