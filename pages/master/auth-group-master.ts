import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';
import { selectFromAutoSuggestion } from '../../utils/field-utillity';

export class AuthGroupMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly authGroupName: Locator;
  private readonly description: Locator;
  private readonly pritingCaption: Locator;
  private readonly userName: Locator;
  private readonly levelNo: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly confirmation: Locator;
  private readonly authGroupNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.authGroupName = page.locator('[name="authGroupName"]');
    this.description = page.locator('[name="description"]');
    this.levelNo = page.locator('//select[contains(@class,"appearance-none")]');
    this.userName = page.getByPlaceholder('Select User Name');
    this.pritingCaption = page.getByPlaceholder('Enter Printing Caption');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
    this.authGroupNameError = page.getByText('Duplicate Department Name not allowed.');
  }

  async isAuthGroupMasterPage() {
    await this.page.getByText('autorization-group-master').isVisible();
  }

  async fillAuthGroupName(authGroupName: string) {
    await this.authGroupName.fill(authGroupName);
  }

  async fillDescription(description: string) {
    await this.description.fill(description);
  }

  async fillPrintingCaption(pringtinCaption: string, index: number) {
    await this.pritingCaption.nth(index).fill(pringtinCaption);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async selectLevel(status: string) {
    await this.levelNo.selectOption(status);
  }

  async selectUserName(query: string, userName: string, index: number) {
    await selectFromAutoSuggestion(this.page, this.userName, query, userName, index);
  }

  async selectLevelNo(levelNo: number, index: number) {
    this.levelNo.nth(index).selectOption(String(levelNo));
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillApproverDetail(
    approverDetail: Array<{
      levelNo: number;
      query: string;
      userName: string;
      printingCaption: string;
    }>,
  ) {
    for (let i = 0; i < approverDetail.length; i++) {
      await this.selectLevelNo(approverDetail[i].levelNo, i);
      await this.selectUserName(approverDetail[i].query, approverDetail[i].userName, i);
      await this.fillPrintingCaption(approverDetail[i].printingCaption, i);
    }
  }

  async fillAuthGroupMasterForm(data: any) {
    await this.fillAuthGroupName(data.name);
    await this.selectStatusNo(data.status);

    if (data.statusRemarks) {
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData('save');
  }

  async getErrorStates() {
    return {
      nameErrorVisible: await this.authGroupNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.authGroupName).toHaveValue(data.name);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
