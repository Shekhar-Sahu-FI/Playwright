import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';

export class StateMaster {
  readonly page: Page;
  readonly formLayout: FormLayout;

  readonly code: Locator;
  readonly countryNo: Locator;
  readonly stateName: Locator;
  readonly statusNo: Locator;
  readonly statusRemarks: Locator;
  readonly codeError: Locator;
  readonly stateNameError: Locator;
  readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="code"]');
    this.countryNo = page.getByPlaceholder('Select Country');
    this.stateName = page.locator('[name="stateName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
    this.codeError = page.getByText('Duplicate Code not allowed.');
    this.stateNameError = page.getByText('Duplicate State Name not allowed.');
  }

  async isStateMasterPage() {
    await this.page.getByText('state-master').isVisible();
  }

  async selectCountry(query: string, countryName: string) {
    await this.countryNo.fill(query);

    await this.page.waitForSelector('#uc-combo-options', { state: 'visible' });

    const option = this.page.locator('#uc-combo-options li', { hasText: countryName });

    await option.click();
  }

  async fillCode(code: string) {
    console.log('Filling code:', code);
    await this.code.fill(code);
    await expect((await this.code.inputValue()).length).toBeLessThanOrEqual(6);
  }

  async fillStateName(stateName: string) {
    console.log('Filling stateName :', stateName);
    await this.stateName.fill(stateName);
    await expect((await this.stateName.inputValue()).length).toBeLessThanOrEqual(50);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
    await expect((await this.statusRemarks.inputValue()).length).toBeLessThanOrEqual(300);
  }

  async fillStateMasterForm(data: any) {
    await this.fillCode(data.code);
    await this.fillStateName(data.name);
    await this.selectStatusNo(data.status);
    if (data.statusRemarks) {
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData('save');
  }

  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.stateNameError.isVisible(),
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
    await expect(this.code).toHaveValue(data.code);
    await expect(this.stateName).toHaveValue(data.name);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
