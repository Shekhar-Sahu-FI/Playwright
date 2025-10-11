import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout';

export class ItemMaster {
    private readonly page: Page;
    private readonly formLayout: FormLayout;

    private readonly itemCode: Locator;
    private readonly itemName: Locator;
    private readonly statusNo: Locator;
    private readonly statusRemarks: Locator;
    private readonly codeError: Locator;
    private readonly itemNameError: Locator;
    private readonly itemCodeError: Locator;
    private readonly confirmation: Locator;
    private readonly subgroup: Locator;
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
    private readonly stockValuationMethodNo: Locator;
    private readonly warehouseName: Locator;
    private readonly reorderLevel: Locator;
    private readonly reorderQty: Locator;
    private readonly standardWt: Locator;
    private readonly unitType: Locator;
    private readonly unitConvertionType: Locator;
    private readonly baseUnitValue: Locator;
    private readonly convertionUnit: Locator;
    private readonly convertionUnitValue: Locator;
    private readonly isUnitConversion: Locator;
    private readonly noOfData: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formLayout = new FormLayout(page);

        this.itemCode = page.locator('[name="itemCode"]');
        this.itemName = page.locator('[name="itemName"]');
        this.subgroup = page.getByPlaceholder("Ex - Stainless Steel Electrodes")
        this.leadTime = page.locator('[name="leadTime"]');
        this.remarks = page.locator('[name="remarks"]');
        this.standardWt = page.locator('[name="standardWt"]');

        this.isMaintainDimension = page.getByLabel('Maintain Item Dimension');
        this.dimensionIn = page.locator('[name="dimensionIn"]');

        this.dimensionUnit = page.getByPlaceholder("Search Dimension Unit")
        this.isMaintainBatchAndExpiry = page.locator('[name="isMaintainBatchAndExpiry"]');
        this.stockValuationMethodNo = page.locator('[name="stockValuationMethodNo"]');
        this.makeManagementTypeNo = page.locator('[name="makeManagementTypeNo"]');
        this.makeCode = page.getByPlaceholder("Select Make Code");
        this.makeName = page.getByPlaceholder("Search...");

        this.warehouseName = page.getByPlaceholder("Select Warehouse Name");
        this.reorderLevel = page.getByPlaceholder("Enter Reorder Level");
        this.reorderQty = page.getByPlaceholder("Enter Reorder Qty.");

        this.unit = page.getByPlaceholder("Ex - Kilogram")

        this.isUnitConversion = page.locator('[name="isUnitConversion"]');
        this.unitType = page.getByPlaceholder("Select Unit Type Name")
        this.unitConvertionType = page.getByPlaceholder("Select Unit Conversion Type Name")
        this.baseUnitValue = page.getByPlaceholder("Enter Base Unit Value")
        this.convertionUnit = page.getByPlaceholder("Select Conversion Unit")
        this.convertionUnitValue = page.getByPlaceholder("Enter Conversion Unit Value")

        this.statusNo = page.locator('select[name="statusNo"]');
        this.statusRemarks = page.locator('[name="statusRemarks"]');

        this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
        this.codeError = page.getByText('Duplicate Code is not allowed in selected Item Subgroup.');
        this.itemCodeError = page.getByText('Duplicate Item Code is not allowed in selected Item Subgroup.');
        this.itemNameError = page.getByText('Duplicate Item Name is not allowed.');

        this.noOfData = page.locator('[name="NoOfData"]');

    }

    async fillCode(code: string) {
        await this.itemCode.fill(code);
    }

    async fillSubgroupName(itemName: string) {
        await this.itemName.fill(itemName);
    }

    async fillGroup(query: string, subgroup: string) {
        await this.subgroup.fill(query);
        await this.selectSuggestion(subgroup);
    }

    async fillUnit(query: string, unit: string) {
        await this.unit.clear();
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
    async fillStandardWt(standardWt: string) {
        await this.standardWt.fill(standardWt);
    }
    async selectDimensionIn(dimensionIn: string) {
        await this.dimensionIn.selectOption(dimensionIn);
    }

    async selectStockValuationMethodNo(stockValuationMethodNo: string) {
        await this.stockValuationMethodNo.selectOption(stockValuationMethodNo);
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

    async fillWarehouse(query: string, warehouseName: string, index: number) {
        await this.warehouseName.nth(index).fill(query);
        await this.selectSuggestion(warehouseName);
    }

    async fillReorderLevel(reorderLevel: string, index: number) {
        await this.reorderLevel.nth(index).fill(reorderLevel);
    }

    async fillReorderQty(reorderQty: string, index: number) {
        await this.reorderQty.nth(index).fill(reorderQty);
    }

    async selectIsUnitConvertion() {
        await this.isUnitConversion.check({ force: true });
    }

    async selectUnitType(unitType: string, index: number) {
        await this.unitType.nth(index).selectOption(unitType)
    }

    async selectUnitConvertionType(unitConvertionType: string, index: number) {
        await this.unitConvertionType.nth(index).selectOption(unitConvertionType)
    }

    async fillConvertionUnitValue(convertionUnitValue: string, index: number) {
        await this.convertionUnitValue.nth(index).fill(convertionUnitValue);
    }

    async fillBaseUnitValue(baseUnitValue: string, index: number) {
        await this.baseUnitValue.nth(index).fill(baseUnitValue);
    }

    async fillConvertionUnit(query: string, warehouseName: string, index: number) {
        await this.convertionUnit.nth(index).fill(query);
        await this.selectSuggestion(warehouseName);
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
        await expect(this.itemName).toHaveAttribute('maxlength', '100');
        await expect(this.itemName).toHaveAttribute('label', 'Subgroup Name');
        await expect(this.itemCode).toHaveAttribute('maxlength', '2');
        await expect(this.itemCode).toHaveAttribute('label', 'Subgroup Code');
        await expect(this.remarks).toHaveAttribute('maxlength', '1000');
        await expect(this.statusNo.locator('option')).toHaveText(['Select Status', 'Active', 'Inactive']);
        await expect(this.statusRemarks).toHaveAttribute('maxlength', '300');
        await expect(this.makeManagementTypeNo.locator('option')).toHaveText(['Select Make Management Type', 'None', 'All', 'Selected']);
        await expect(this.dimensionIn.locator('option')).toHaveText(['Select Dimension In', 'Length Only', 'Length & Width']);
    }

    async getErrorStates() {
        return {
            codeErrorVisible: await this.codeError.isVisible(),
            itemCodeErrorVisible: await this.itemCodeError.isVisible(),
            itemNameErrorVisible: await this.itemNameError.isVisible(),
        };
    }

    async fillItemMasterForm(data: any) {
        await this.fillCode(data.code);
        await this.fillSubgroupName(data.name);
        await this.fillGroup(data.query, data.subgroup);
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
            for (let i = 0; i < data.ItemMasterMakeDetail.length; i++) {
                const { query, makeName } = data.ItemMasterMakeDetail[i];
                await this.fillMake(query, makeName, i);
            }
        }

        await this.selectStatusNo(data.status);
        if (data.statusRemarks) {
            await this.fillStatusRemarks(data.statusRemarks);
        }
        await this.formLayout.saveData("save");
    }


    async getRowByCode(code: string) {
        await this.noOfData.selectOption("100");

        return this.page.locator('tr', {
            has: this.page.locator(`td >> text=${code}`)
        });
    }

    async verifyFormData(data: any) {

        await expect(this.itemCode).toHaveValue(data.itemCode);
        await expect(this.itemName).toHaveValue(data.itemName);
        await expect(this.leadTime).toHaveValue(data.leadTime);
        await expect(this.remarks).toHaveValue(data.remarks || "");


        if (data.itemSubgroupName) {
            await expect(this.subgroup).toHaveValue(data.itemSubgroupName);
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

        if (data.makeManagementTypeNo === "3" && data.ItemMasterMakeDetail?.length) {
            for (let i = 0; i < data.ItemMasterMakeDetail.length; i++) {
                const { query, makeName, makeCode } = data.ItemMasterMakeDetail[i];
                await expect(this.makeCode.nth(i)).toHaveValue(makeCode);
                await expect(this.makeName.nth(i)).toHaveValue(makeName);
            }
        }

        if (data.itemMasterWarehouseDetail?.length > 0) {
            for (let i = 0; i < data.itemMasterWarehouseDetail.length; i++) {
                const { query, warehouseName, reorderLevel, reorderQty } = data.itemMasterWarehouseDetail[i];
                await expect(this.warehouseName.nth(i)).toHaveValue(warehouseName);
                await expect(this.reorderLevel.nth(i)).toHaveValue(reorderLevel);
                await expect(this.reorderQty.nth(i)).toHaveValue(reorderQty);

            }
        }

        if (data.isUnitConversion) {
            await expect(this.isUnitConversion).toBeChecked();
            for (let i = 0; i < data.itemMasterUnitConvertionDetail.length; i++) {
                const { unitType, unitConvertionType, baseUnitValue, unitConvertionNameQuery, unitConvertionName, unitConvertionCode, unitConvertionValue } = data.itemMasterUnitConvertionDetail[i];
                await expect(this.unitType.nth(i)).toHaveValue(unitType);
                await expect(this.unitConvertionType.nth(i)).toHaveValue(unitConvertionType);
                await expect(this.baseUnitValue.nth(i)).toHaveValue(baseUnitValue);
                await expect(this.convertionUnit.nth(i)).toHaveValue(unitConvertionCode);
                await expect(this.convertionUnitValue.nth(i)).toHaveValue(unitConvertionValue);
            }
        }

        await expect(this.statusNo).toHaveValue(data.status);

        if (data.status === "2" && data.statusRemarks) {
            await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
        }
    }


}
