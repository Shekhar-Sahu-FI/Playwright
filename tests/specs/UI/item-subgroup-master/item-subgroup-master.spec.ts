import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { ItemSubgroupMaster, ItemSubgroupMasterFormData } from "../../../../pages/item-subgroup-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormOperation } from "../../../../utils/form-operation";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let itemSubgroupMasterPage: ItemSubgroupMaster;
let formLayout: FormLayout;
let formOperation: FormOperation<ItemSubgroupMasterFormData>;

/**
 * SaveData: Fills the Item Subgroup Master form and saves/updates as needed.
 */
const SaveData = async (
    page: Page,
    data: ItemSubgroupMasterFormData,
    mode: "save" | "update" | "" = ""
) => {
    await test.step("Fill the form", async () => {
        await itemSubgroupMasterPage.fillItemSubgroupMasterForm(data);
    });
    if (mode) {
        await test.step("Save and verify", async () => {
            await formLayout.saveData(mode);
            await expect(page).toHaveURL(/.*item-subgroup-master/);
            const row = itemSubgroupMasterPage.getRowByCode(data.itemSubgroupName);
            await expect(row).toHaveCount(1);
        });
    }
};

test.describe("Item Subgroup Master UI Tests", () => {
    const testData: Record<string, ItemSubgroupMasterFormData | any> = loadTestData("test-data/ui/item-subgroup-master-data.json");

    test.beforeEach(async ({ page }) => {
        config = new TestConfig();
        await page.goto(config.appUrl);

        loginPage = new LoginPage(page);
        await loginPage.login(config.email, config.password);

        formLayout = new FormLayout(page);

        homePage = new HomePage(page);
        await homePage.isHomePage();
        await homePage.masterSearch("MMSG");

        itemSubgroupMasterPage = new ItemSubgroupMaster(page);
        await expect(page).toHaveURL(/.*item-subgroup-master/);

        formOperation = new FormOperation(page, formLayout, SaveData, itemSubgroupMasterPage);
    });

    // Data-driven creation tests
    for (const [key, data] of Object.entries(testData)) {
        if (key.startsWith("saveWith") || key === "duplicateError") {
            test(`Create Subgroup: ${key}`, async ({ page }) => {
                await formOperation.saveAndVerify(data);
            });
        }
    }

    test("Mandatory Validation For Subgroup", async ({ page }) => {
        await formOperation.checkValidationError([
            "Enter Subgroup Code", "Enter Subgroup Code", "Select Item Group", "Select a Unit", "Enter Lead Time", "Enter Status Remarks"
        ])
    });

    test("Subgroup Save And Update", async ({ page }) => {
        await formOperation.updateData(testData.saveAndUpdate, testData.saveAndUpdate.firstSave.itemSubgroupName);
    });

    test("Check Subgroup Tab Indexing", async ({ page }) => {
        await formOperation.openNewForm();
        await itemSubgroupMasterPage.checkTabIndexing();
    });

    test("Delete Saved Item Subgroup", async ({ page }) => {
        await formOperation.deleteAndVerify(testData.saveAndDelete, testData.saveAndDelete.itemSubgroupName);
    });

    test("Check Item Subgroup Field Parameters", async ({ page }) => {
        await formOperation.openNewForm();
        await itemSubgroupMasterPage.checkFieldParameter();
    });

    test("Duplicate Item Subgroup Validation", async ({ page }) => {
        await formOperation.duplicateDataValidation(testData.duplicateError);
        const { codeErrorVisible, subgroupCodeErrorVisible, nameErrorVisible } = await itemSubgroupMasterPage.getErrorStates();
        expect(codeErrorVisible).toBeTruthy();
        expect(subgroupCodeErrorVisible).toBeTruthy();
        expect(nameErrorVisible).toBeTruthy();
    });



});


