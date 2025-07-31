import { Page, test, expect } from "@playwright/test";
import { TestConfig } from "../../../../test.config";
import { LoginPage } from "../../../../pages/login";
import { BusinessUnitMaster } from "../../../../pages/business-unit";
import { loadTestData } from "../../../../utils/data-provider";

let config: TestConfig;
let businessUnit: BusinessUnitMaster;
let loginPage: LoginPage;

test("Business Unit Registration @BURedistration", async ({ page }) => {
  const testData = loadTestData("test-data/ui/bu-registration-data.json");
  config = new TestConfig();
  businessUnit = new BusinessUnitMaster(page);

  //   await page.goto(config.appUrl);
  //   loginPage = new LoginPage(page);
  //   await loginPage.login(config.email, config.password);

  await page.goto(config.verifyLink);
  await expect(page).toHaveURL(/.*verify-email/);
  await expect(page.getByText("Email Verified !!")).toBeVisible();
  await page.waitForURL(/.*dashboard/);
  await expect(page.locator("h2", { hasText: "Business Unit" })).toBeVisible();
  await businessUnit.addState(testData?.stateData || {});
  await businessUnit.fillData(testData, "save", true);
  await expect(page.locator("h1", { hasText: "Welcome to ARPA ERP" })).toBeVisible(); 
});
