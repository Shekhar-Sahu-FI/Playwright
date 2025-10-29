
import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout';
import { checkTabOrderByFocus } from '../utils/checkTabOrderByFocus';

export interface ItemSubgroupMasterFormData {
    itemSubgroupCode: string;
    itemSubgroupName: string;
    itemGroupQuery: string;
    itemGroupName: string;
    unitQuery: string;
    unitCode?: string;
    unitName: string;
    leadTime: string;
    remarks?: string;
    isMaintainDimension?: boolean;
    dimensionIn?: string;
    dimensionUnitQuery?: string;
    dimensionUnitName?: string;
    dimensionUnitCode?: string;
    isMaintainBatchAndExpiry?: boolean;
    makeManagementTypeNo: string;
    itemSubgroupMasterMakeDetail?: Array<{ query: string; makeName: string; makeCode: string }>;
    status: string;
    statusRemarks?: string;
}

export class ItemSubgroupMaster {
    private readonly page: Page;
    private readonly formLayout: FormLayout;

    // Locators
    private readonly subgroupCode: Locator;
    private readonly code: Locator;
    private readonly itemGroupName: Locator;
    private readonly itemCategoryName: Locator;
    private readonly subgroupName: Locator;
    private readonly statusNo: Locator;
    private readonly statusRemarks: Locator;
    private readonly codeError: Locator;
    private readonly subgroupNameError: Locator;
    private readonly subgroupCodeError: Locator;
    private readonly confirmation: Locator;
    private readonly group: Locator;
    private readonly unit: Locator;
    private readonly leadTime: Locator;
    private readonly remarks: Locator;
    private readonly isMaintainDimension: Locator;
    private readonly dimensionIn: Locator;
    private readonly dimensionUnit: Locator;
    private readonly isMaintainBatchAndExpiry: Locator;
    private readonly makeManagementTypeNo: Locator;
    private readonly makeCode: Locator;
    private readonly makeName: Locator;

    // Constants
    private static readonly ERROR_MESSAGES = {
        code: 'Duplicate Code is not allowed in selected Item Group.',
        subgroupCode: 'Duplicate Subgroup Code is not allowed in selected Item Group.',
        subgroupName: 'Duplicate Subgroup Name is not allowed in selected Item Group.'
    };

    constructor(page: Page) {
        this.page = page;
        this.formLayout = new FormLayout(page);
        this.code = page.locator('#code'); // readonly
        this.itemGroupName = page.getByPlaceholder('Ex - Electrodes');
        this.itemCategoryName = page.locator('#itemCategoryName'); // readonly
        this.leadTime = page.locator('[name="leadTime"]');
        this.remarks = page.locator('[name="remarks"]');
        this.subgroupCode = page.locator('[name="subgroupCode"]');
        this.subgroupName = page.locator('[name="subgroupName"]');
        this.group = page.getByPlaceholder("Ex - Electrodes")
        this.leadTime = page.locator('[name="leadTime"]');
        this.remarks = page.locator('[name="remarks"]');

        this.isMaintainDimension = page.getByLabel('Maintain Item Dimension');
        this.dimensionIn = page.locator('[name="dimensionIn"]');

        this.dimensionUnit = page.getByPlaceholder("Search Dimension Unit")
        this.isMaintainBatchAndExpiry = page.locator('[name="isMaintainBatchAndExpiry"]');
        this.makeManagementTypeNo = page.locator('[name="makeManagementTypeNo"]');
        this.makeCode = page.getByPlaceholder("Select Make Code");
        this.makeName = page.getByPlaceholder("Search...");

        this.unit = page.getByPlaceholder("Ex - Kilogram")
        this.statusNo = page.locator('select[name="statusNo"]');
        this.statusRemarks = page.locator('[name="statusRemarks"]');
        this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
        this.codeError = page.getByText(ItemSubgroupMaster.ERROR_MESSAGES.code);
        this.subgroupCodeError = page.getByText(ItemSubgroupMaster.ERROR_MESSAGES.subgroupCode);
        this.subgroupNameError = page.getByText(ItemSubgroupMaster.ERROR_MESSAGES.subgroupName);
    }


    /** Fill subgroup code field. */
    async fillCode(code: string) {
        await this.subgroupCode.fill(code);
    }

    /** Fill subgroup name field. */
    async fillSubgroupName(subgroupName: string) {
        await this.subgroupName.fill(subgroupName);
    }

    /** Fill group field and select suggestion. */
    async fillGroup(query: string, group: string) {
        await this.group.fill(query);
        await this.selectSuggestion(group);
    }

    /** Fill unit field and select suggestion. */
    async fillUnit(query: string, unit: string) {
        await this.unit.fill(query);
        await this.selectSuggestion(unit);
    }

    /** Fill lead time field. */
    async fillLeadTime(leadTime: string) {
        await this.leadTime.fill(leadTime);
    }

    /** Fill remarks field. */
    async fillRemarks(remarks: string) {
        await this.remarks.fill(remarks);
    }

    /** Select maintain dimension checkbox. */
    async selectIsMaintainDimension() {
        await this.isMaintainDimension.check({ force: true });
    }

    /** Fill dimension unit field and select suggestion. */
    async fillDimensionUnit(query: string, dimensionUnit: string) {
        await this.dimensionUnit.fill(query);
        await this.selectSuggestion(dimensionUnit);
    }

    /** Select dimension in dropdown. */
    async selectDimensionIn(dimensionIn: string) {
        await this.dimensionIn.selectOption(dimensionIn);
    }

    /** Select maintain batch and expiry checkbox. */
    async selectIsMaintainBatchAndExpiry() {
        await this.isMaintainBatchAndExpiry.check({ force: true });
    }

    /** Select make management type dropdown. */
    async selectMakeManagementTypeNo(makeManagementTypeNo: string) {
        await this.makeManagementTypeNo.selectOption(makeManagementTypeNo);
    }

    /** Select status dropdown. */
    async selectStatusNo(status: string) {
        await this.statusNo.selectOption(status);
    }

    /** Fill status remarks field. */
    async fillStatusRemarks(statusRemarks: string) {
        await this.statusRemarks.fill(statusRemarks);
    }

    /** Fill make code and select suggestion. */
    async fillMake(query: string, makeName: string, index: number) {
        await this.makeCode.nth(index).fill(query);
        await this.selectSuggestion(makeName);
    }

    /** Select suggestion from dropdown or table. */
    async selectSuggestion(name: string) {
        const suggestion = this.page.getByRole('cell', { name: `${name}` });
        await expect(suggestion).toBeVisible({ timeout: 6000 });
        for (let i = 0; i < 3; i++) {
            try {
                await suggestion.click();
                break;
            } catch (err) {
                if (i === 2) throw err;
                await this.page.waitForTimeout(500);
            }
        }
    }

    /** Check field parameters and constraints. */
    async checkFieldParameter() {

        // Subgroup Name
        await expect.soft(this.subgroupName, "Subgroup Name should have maxlength=100")
            .toHaveAttribute('maxlength', '100');
        await expect.soft(this.subgroupName, "Subgroup Name should have correct label text")
            .toHaveAttribute('label', 'Subgroup Name');

        // Subgroup Code
        await expect.soft(this.subgroupCode, "Subgroup Code should have maxlength=2")
            .toHaveAttribute('maxlength', '2');
        await expect.soft(this.subgroupCode, "Subgroup Code should have correct label text")
            .toHaveAttribute('label', 'Subgroup Code');

        // Remarks
        await expect.soft(this.remarks, "Remarks field should have maxlength=1000")
            .toHaveAttribute('maxlength', '1000');
        await expect.soft(this.remarks, "Remarks field should have correct label text")
            .toHaveAttribute('label', 'Remarks');

        // Status Dropdown
        await expect.soft(this.statusNo.locator('option'), "Status dropdown should contain all expected options")
            .toHaveText(['Select Status', 'Active', 'Inactive']);

        // Status Remarks
        await expect.soft(this.statusRemarks, "Status Remarks should have maxlength=300")
            .toHaveAttribute('maxlength', '300');

        // Make Management Type Dropdown
        await expect.soft(this.makeManagementTypeNo.locator('option'), "Make Management Type dropdown should contain all expected options")
            .toHaveText(['Select Make Management Type', 'None', 'All', 'Selected']);

        // Dimension In Dropdown
        await expect.soft(this.dimensionIn.locator('option'), "Dimension In dropdown should contain all expected options")
            .toHaveText(['Select Dimension In', 'Length Only', 'Length & Width']);

    }

    async checkTabIndexing() {
        await checkTabOrderByFocus(this.page, [
            this.code,
            this.subgroupCode,
            this.subgroupName,
            this.group,
            this.itemCategoryName,
            this.unit,
            this.leadTime,
            this.remarks,
            this.isMaintainDimension,
            this.isMaintainBatchAndExpiry,
            this.makeManagementTypeNo,
            this.statusNo,
        ]);
    }

    /** Get error states for validation. */
    async getErrorStates() {
        return {
            codeErrorVisible: await this.codeError.isVisible(),
            subgroupCodeErrorVisible: await this.subgroupCodeError.isVisible(),
            nameErrorVisible: await this.subgroupNameError.isVisible(),
        };
    }


    /** Fill the entire Item Subgroup Master form. */
    async fillItemSubgroupMasterForm(data: ItemSubgroupMasterFormData) {
        await this.fillCode(data.itemSubgroupCode);
        await this.fillSubgroupName(data.itemSubgroupName);
        await this.fillGroup(data.itemGroupQuery, data.itemGroupName);
        await this.fillUnit(data.unitQuery, data.unitName);
        await this.fillLeadTime(data.leadTime);
        await this.fillRemarks(data.remarks || "");

        if (data.isMaintainDimension) {
            await this.selectIsMaintainDimension();
            if (data.dimensionIn) await this.selectDimensionIn(data.dimensionIn);
            if (data.dimensionUnitQuery && data.dimensionUnitName) {
                await this.fillDimensionUnit(data.dimensionUnitQuery, data.dimensionUnitName);
            }
        }

        if (data.isMaintainBatchAndExpiry) {
            await this.selectIsMaintainBatchAndExpiry();
        }

        if (data.makeManagementTypeNo === "3" && data.itemSubgroupMasterMakeDetail?.length) {
            for (let i = 0; i < data.itemSubgroupMasterMakeDetail.length; i++) {
                const { query, makeName } = data.itemSubgroupMasterMakeDetail[i];
                await this.fillMake(query, makeName, i);
            }
        }

        await this.selectStatusNo(data.status);
        if (data.statusRemarks) {
            await this.fillStatusRemarks(data.statusRemarks);
        }
        await this.formLayout.saveData("save");
    }


    /** Get table row by code. */
    getRowByCode(code: string) {
        return this.page.locator('tr', {
            has: this.page.locator(`td >> text=${code}`)
        });
    }

    /** Verify form data matches expected values. */
    async verifyFormData(data: ItemSubgroupMasterFormData) {
        await expect(this.subgroupCode).toHaveValue(data.itemSubgroupCode);
        await expect(this.subgroupName).toHaveValue(data.itemSubgroupName);
        await expect(this.leadTime).toHaveValue(data.leadTime);
        await expect(this.remarks).toHaveValue(data.remarks || "");

        if (data.itemGroupName) {
            await expect(this.group).toHaveValue(data.itemGroupName);
        }
        if (data.unitName && data.unitCode) {
            await expect(this.unit).toHaveValue(data.unitCode);
        }

        if (data.isMaintainDimension) {
            await expect(this.isMaintainDimension).toBeChecked();
            await expect(this.dimensionIn).toHaveValue(data.dimensionIn || "");
            if (data.dimensionUnitCode) {
                await expect(this.dimensionUnit).toHaveValue(data.dimensionUnitCode || "");
            }
        } else {
            await expect(this.isMaintainDimension).not.toBeChecked();
        }

        if (data.isMaintainBatchAndExpiry) {
            await expect(this.isMaintainBatchAndExpiry).toBeChecked();
        } else {
            await expect(this.isMaintainBatchAndExpiry).not.toBeChecked();
        }

        await expect(this.makeManagementTypeNo).toHaveValue(data.makeManagementTypeNo);

        if (data.makeManagementTypeNo === "3" && data.itemSubgroupMasterMakeDetail?.length) {
            for (let i = 0; i < data.itemSubgroupMasterMakeDetail.length; i++) {
                const { makeName, makeCode } = data.itemSubgroupMasterMakeDetail[i];
                await expect(this.makeCode.nth(i)).toHaveValue(makeCode);
                await expect(this.makeName.nth(i)).toHaveValue(makeName);
            }
        }

        await expect(this.statusNo).toHaveValue(data.status);
        if (data.status === "2" && data.statusRemarks) {
            await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
        }
    }


}
