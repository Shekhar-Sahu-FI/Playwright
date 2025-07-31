import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { BusinessUnitMaster } from "../../../../pages/business-unit";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let buMasterPage: BusinessUnitMaster;
let formLayout: FormLayout;
let formHelper : FormHelper;

test.describe("Business Unit Master Tests", () => {
  const testData = loadTestData("test-data/ui/business-unit-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);
    
    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.clickAvatar();
    await homePage.clickOrganization();
    
    buMasterPage = new BusinessUnitMaster(page);
    await expect(page).toHaveURL(/.*organization/);

    // formHelper = new FormHelper(page, formLayout, SaveData, buMasterPage );
  });

    test("New BU creation 1 @bu1", async ({ page }) => {
        await page.locator('[name="addBUbtn"]').click();
        await buMasterPage.fillData(testData.save2, "save");
    });

    test("Update BU  @buUpate", async ({ page }) => {
        await page.locator('[name="addBUbtn"]').click();
        await buMasterPage.fillData(testData.update.firstSave, "save");
        await page.locator(`[name="${testData.update.firstSave.name}-Edit"]`).click();
        await buMasterPage.verifyFormData(testData.update.firstSave); 
        await buMasterPage.fillData(testData.update.update, "update");
    });

    test("Delete BU @deleteBU",async ({page})=>{
        await page.locator('[name="addBUbtn"]').click();
        await buMasterPage.fillData(testData.delete, "save");
        await page.locator(`[name="${testData.delete.name}-Edit"]`).click();
        await buMasterPage.verifyFormData(testData.delete)
        await buMasterPage.deteleData(); 
    })

    test("Add Child BU @AddChildBU", async ({ page })=>{
        await page.locator('[name="addBUbtn"]').click();
        await buMasterPage.fillData(testData.addChild.parent, "save");
        await page.locator(`[name="${testData.addChild.parent.name}-Add"]`).click();
        await buMasterPage.fillData(testData.addChild.child, "save");
    })



})