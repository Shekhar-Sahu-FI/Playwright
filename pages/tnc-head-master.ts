import { expect, Page, Locator } from '@playwright/test';
import { FormLayout } from '../utils/form-layout';

export class TnCMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly tncHeadName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly tncHeadNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.tncHeadName = page.locator('[name="headName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.tncHeadNameError = page.getByText('Duplicate Make Name is not allowed.');
  }

  async isMakeMasterPage() {
    await this.page.getByText('make-master').isVisible();
  }

  async fillTncHeadName(tncHeadName: string) {
    await this.tncHeadName.fill(tncHeadName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillTnCMasterForm(data: any) {
    await this.fillTncHeadName(data.name);
    await this.selectStatusNo(data.status);
    if (data.statusRemarks) {
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData('save');
  }

  async getErrorStates() {
    return {
      nameErrorVisible: await this.tncHeadNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    const dropdown = this.page.locator('select');
    dropdown.selectOption('100');
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.tncHeadName).toHaveValue(data.name);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
