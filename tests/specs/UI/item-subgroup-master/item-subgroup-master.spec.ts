import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { ItemSubgroupMaster } from "../../../../pages/item-subgroup-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let itemSubgroupMasterPage: ItemSubgroupMaster;
let formLayout: FormLayout;
let formHelper: FormHelper;

test.describe("Item subgroup Master Tests", () => {
    const testData = loadTestData("test-data/ui/item-subgroup-master-data.json");

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

        formHelper = new FormHelper(page, formLayout, SaveData, itemSubgroupMasterPage);
    });

    test("New Item subgroup creation 1 @saveSubgroupNew1", async ({ page }) => {
        await formHelper.saveAndVerify(testData.saveWithAllData)
    });

    test("Subgroup with mandatory only", async ({ page }) => {
        await formHelper.saveAndVerify(testData.saveWithMandatoryData)
    });

    test("Subgroup with maximum Characters", async ({ page }) => {
        await formHelper.saveAndVerify(testData.saveWithMaxChar)
    });

    test("Subgroup with other than mandatory", async ({ page }) => {
        await formHelper.saveAndVerify(testData.saveWithMandatoryData)
    });

    test("Mandatory Validation For Subgroup", async ({ page }) => {
        await formHelper.checkValidationError([
            "Enter Subgroup Code", "Enter Subgroup Code", "Select Item Group", "Select a Unit", "Enter Lead Time", "Enter Status Remarks"
        ])
    });

    test("Subgroup Save And Update", async ({ page }) => {
        await formHelper.updateData(testData.saveAndUpdate, testData.saveAndUpdate.firstSave.itemSubgroupName)
    });

    test("Delete Saved Item Subgroup", async ({ page }) => {
        await formHelper.deleteAndVerify(testData.saveAndDelete, testData.saveAndDelete.itemSubgroupName)
    });

    test("Check Item Subgroup Field Parameters", async ({ page }) => {
        await formHelper.openNewForm();
        await itemSubgroupMasterPage.checkFieldParameter();
    });

    test("Duplicate Item Subgroup Validation", async ({
        page,
    }) => {
        await formHelper.duplicateDataValidation(testData.duplicateError);

        const { codeErrorVisible, subgroupCodeErrorVisible, nameErrorVisible } =
            await itemSubgroupMasterPage.getErrorStates();
        expect(codeErrorVisible).toBeTruthy();
        expect(subgroupCodeErrorVisible).toBeTruthy();
        expect(nameErrorVisible).toBeTruthy();
    });
});


const SaveData = async (page: Page, data: any, mode: "save" | "update" | "" = "") => {
    await test.step("Fill the form", async () => {
        await itemSubgroupMasterPage.fillCode(data.itemSubgroupCode);
        await itemSubgroupMasterPage.fillSubgroupName(data.itemSubgroupName);
        await itemSubgroupMasterPage.fillGroup(data.itemGroupQuery, data.itemGroupName);
        await itemSubgroupMasterPage.fillUnit(data.unitQuery, data.unitName);
        await itemSubgroupMasterPage.fillLeadTime(data.leadTime);
        await itemSubgroupMasterPage.fillRemarks(data.remarks || "");

        if (data.isMaintainDimension) {
            await itemSubgroupMasterPage.selectIsMaintainDimension();
            await itemSubgroupMasterPage.selectDimensionIn(data.dimensionIn);
            await itemSubgroupMasterPage.fillDimensionUnit(data.dimensionUnitQuery, data.dimensionUnitName);
        }

        if (data.isMaintainBatchAndExpiry) {
            await itemSubgroupMasterPage.selectIsMaintainBatchAndExpiry();
        }

        if (data.makeManagementTypeNo == 3 || data.makeManagementTypeNo == 2) {
            await itemSubgroupMasterPage.selectMakeManagementTypeNo(data.makeManagementTypeNo);
        }

        if (data.makeManagementTypeNo == 3) {
            for (let i = 0; i < data.itemSubgroupMasterMakeDetail.length; i++) {
                const { query, makeName } = data.itemSubgroupMasterMakeDetail[i];
                await itemSubgroupMasterPage.fillMake(query, makeName, i);
            }
        }

        await itemSubgroupMasterPage.selectStatusNo(data.status);
        if (data.statusRemarks) {
            await itemSubgroupMasterPage.fillStatusRemarks(data.statusRemarks);
        }

    });

    if (mode) {
        await test.step("Save and verify", async () => {
            await formLayout.saveData(mode);
            console.log(mode)
            await expect(page).toHaveURL(/.*item-subgroup-master/);
            const row = itemSubgroupMasterPage.getRowByCode(data.itemSubgroupName);
            await expect(row).toHaveCount(1);
        });
    }

};


const data = {
    itemSubgroupCode: "S8",
    itemSubgroupName: "Stainless Steel",
    itemGroupQuery: "Qua",
    itemGroupName: "Quality Equipment",
    unitQuery: "unit",
    unitName: "Unit 02",
    leadTime: "5",
    remarks: "This is for Quality.",
    isMaintainDimension: true,
    dimensionIn: "1",
    dimensionUnitQuery: "unit",
    dimensionUnitName: "unit 04",
    isMaintainBatchAndExpiry: false,
    makeManagementTypeNo: "3",
    itemSubgroupMasterMakeDetail: [
        {
            query: "make",
            makeName: "Make 03"
        },
        {
            query: "make",
            makeName: "Make 05"
        },
        {
            query: "make",
            makeName: "Make 06"
        }
    ],
    status: "2",
    statusRemarks: "This is item is not for use right now."
}

