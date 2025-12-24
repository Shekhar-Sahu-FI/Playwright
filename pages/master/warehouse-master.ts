import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';

export class WarehouseMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly warehouseName: Locator;
  private readonly subgroupSearch: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly warehouseNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="code"]');
    this.warehouseName = page.locator('[name="warehouseName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.subgroupSearch = page.locator('[placeholder="Search Subgroup"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.codeError = page.getByText('Duplicate Code not allowed.');
    this.warehouseNameError = page.getByText('Duplicate Warehouse Name not allowed.');
  }

  async isWarehouseMasterPage() {
    await this.page.getByText('warehouse-master').isVisible();
  }

  async fillCode(code: string) {
    await this.code.type(code);
  }

  async fillWarehouseName(warehouseName: string) {
    await this.warehouseName.type(warehouseName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillWarehouseMasterForm(data: any) {
    await this.fillCode(data.code);
    await this.fillWarehouseName(data.name);
    await this.selectBusinessUnit(data.businessUnit);
    await this.selectStatusNo(data.status);
    if (data.status === '2') {
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData('save');
  }

  async selectBusinessUnit(children: string[]) {
    // const parentLabel = this.page.locator("label", { hasText: parent });
    // await parentLabel.click();

    for (const child of children) {
      const childLabel = this.page.locator('label', { hasText: child });
      await childLabel.click({ force: true });
    }
  }

  async checkSubgroup(subgroupNames: string[]): Promise<void> {
    for (const subgroupName of subgroupNames) {
      const checkbox = this.page.locator('label', { hasText: subgroupName }).locator('input[type="checkbox"]').last();

      await checkbox.check({ force: true });

      await expect(checkbox, `Expected subgroup "${subgroupName}" checkbox to be checked`).toBeChecked();
    }
  }

  async checkBusinessUnit(children: string[]) {
    for (const child of children) {
      const childLabel = this.page.locator('label', { hasText: child });
      await expect(childLabel).toBeChecked();
    }
  }

  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.warehouseNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.warehouseName).toHaveValue(data.name);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
    await this.checkBusinessUnit(data.businessUnit1);
    await this.checkSubgroup(data.subgroups);
  }
}
