import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout';

export class ItemSubgroupMaster {
    private readonly page: Page;
    private readonly formLayout: FormLayout;

    private readonly subgroupCode: Locator;
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

    constructor(page: Page) {
        this.page = page;
        this.formLayout = new FormLayout(page);

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
        this.codeError = page.getByText('Duplicate Code is not allowed in selected Item Group.');
        this.subgroupCodeError = page.getByText('Duplicate Subgroup Code is not allowed in selected Item Group.');
        this.subgroupNameError = page.getByText('Duplicate Subgroup Name is not allowed in selected Item Group.');
    }


    async fillCode(code: string) {
        await this.subgroupCode.fill(code);
    }

    async fillSubgroupName(subgroupName: string) {
        await this.subgroupName.fill(subgroupName);
    }

    async fillGroup(query: string, group: string) {
        await this.group.fill(query);
        await this.selectSuggestion(group);
    }

    async fillUnit(query: string, unit: string) {
        await this.unit.fill(query);
        await this.selectSuggestion(unit);
    }

    async fillLeadTime(leadTime: string) {
        await this.leadTime.fill(leadTime);
    }

    async fillRemarks(remarks: string) {
        await this.remarks.fill(remarks);
    }

    async selectIsMaintainDimension() {
        await this.isMaintainDimension.check({ force: true });
    }

    async fillDimensionUnit(query: string, dimensionUnit: string) {
        await this.dimensionUnit.fill(query);
        await this.selectSuggestion(dimensionUnit);
    }

    async selectDimensionIn(dimensionIn: string) {
        await this.dimensionIn.selectOption(dimensionIn);
    }

    async selectIsMaintainBatchAndExpiry() {
        await this.isMaintainBatchAndExpiry.check({ force: true });
    }

    async selectMakeManagementTypeNo(makeManagementTypeNo: string) {
        await this.makeManagementTypeNo.selectOption(makeManagementTypeNo);
    }

    async selectStatusNo(status: string) {
        await this.statusNo.selectOption(status);
    }

    async fillStatusRemarks(statusRemarks: string) {
        await this.statusRemarks.fill(statusRemarks);
    }

    async fillMake(query: string, makeName: string, index: number) {
        await this.makeCode.nth(index).fill(query);
        await this.selectSuggestion(makeName);
    }

    async selectSuggestion(name: string) {

        const suggestion = await this.page.getByRole('cell', { name: `${name}` })
        // const suggestion = this.page.locator(`td:has-text("${name}")`);
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

    async checkFieldParameter() {
        await expect(this.subgroupName).toHaveAttribute('maxlength', '100');
        await expect(this.subgroupName).toHaveAttribute('label', 'Subgroup Name');
        await expect(this.subgroupCode).toHaveAttribute('maxlength', '2');
        await expect(this.subgroupCode).toHaveAttribute('label', 'Subgroup Code');
        await expect(this.remarks).toHaveAttribute('maxlength', '1000');
        await expect(this.statusNo.locator('option')).toHaveText(['Select Status', 'Active', 'Inactive']);
        await expect(this.statusRemarks).toHaveAttribute('maxlength', '300');
        await expect(this.makeManagementTypeNo.locator('option')).toHaveText(['Select Make Management Type', 'None', 'All', 'Selected']);
        await expect(this.dimensionIn.locator('option')).toHaveText(['Select Dimension In', 'Length Only', 'Length & Width']);
    }

    async getErrorStates() {
        return {
            codeErrorVisible: await this.codeError.isVisible(),
            subgroupCodeErrorVisible: await this.subgroupCodeError.isVisible(),
            nameErrorVisible: await this.subgroupNameError.isVisible(),
        };
    }

    async fillItemSubgroupMasterForm(data: any) {
        await this.fillCode(data.code);
        await this.fillSubgroupName(data.name);
        await this.fillGroup(data.query, data.group);
        await this.fillUnit(data.query, data.unit);
        await this.fillLeadTime(data.leadTime);
        await this.fillRemarks(data.remarks || "");

        if (data.isMaintainDimension) {
            await this.selectIsMaintainDimension();
            await this.selectDimensionIn(data.dimensionIn);
            await this.fillDimensionUnit(data.dimensionUnit.query, data.dimensionUnit.unitName);
        }

        if (data.isMaintainBatchAndExpiry) {
            await this.selectIsMaintainBatchAndExpiry();
        }

        if (data.makeManagementTypeNo == 3) {
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


    getRowByCode(code: string) {
        return this.page.locator('tr', {
            has: this.page.locator(`td >> text=${code}`)
        });
    }

    async verifyFormData(data: any) {

        await expect(this.subgroupCode).toHaveValue(data.itemSubgroupCode);
        await expect(this.subgroupName).toHaveValue(data.itemSubgroupName);
        await expect(this.leadTime).toHaveValue(data.leadTime);
        await expect(this.remarks).toHaveValue(data.remarks || "");


        if (data.itemGroupName) {
            await expect(this.group).toHaveValue(data.itemGroupName);
        }
        if (data.unitName) {
            await expect(this.unit).toHaveValue(data.unitCode);
        }

        if (data.isMaintainDimension) {
            await expect(this.isMaintainDimension).toBeChecked();
            await expect(this.dimensionIn).toHaveValue(data.dimensionIn || "");
            await expect(this.dimensionUnit).toHaveValue(data.dimensionUnitCode || "");
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
                const { query, makeName, makeCode } = data.itemSubgroupMasterMakeDetail[i];
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
