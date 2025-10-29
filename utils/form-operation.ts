import { expect, Locator, Page, test } from '@playwright/test';
import { FormLayout } from './form-layout';
import { checkInputAttributes } from './inputBox';


/**
 * FormOperations provides high-level form actions for master pages.
 * Uses generics for type safety and modularizes repeated logic.
 */
export class FormOperation<T = any> {
  readonly page: Page;
  readonly formLayout: FormLayout;
  readonly masterPage: { verifyFormData: (data: T) => Promise<void>; selectStatusNo: (status: string) => Promise<void> };
  readonly saveData: (page: Page, data: T, mode?: 'save' | 'update' | '') => Promise<void>;

  constructor(
    page: Page,
    formLayout: FormLayout,
    saveData: (page: Page, data: T, mode?: 'save' | 'update' | '') => Promise<void>,
    masterPage: { verifyFormData: (data: T) => Promise<void>; selectStatusNo: (status: string) => Promise<void> }
  ) {
    this.page = page;
    this.formLayout = formLayout;
    this.masterPage = masterPage;
    this.saveData = saveData;
  }


  /** Opens a new form and verifies navigation. */
  async openNewForm() {
    await test.step('Open new form', async () => {
      await this.formLayout.clickAdd();
      await expect(this.page).toHaveURL(/.*new/);
    });
  }


  /** Returns a locator for a table row by code. */
  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }


  /** Saves a new record and verifies creation. */
  async saveAndVerify(data: T) {
    await this.openNewForm();
    await this.saveData(this.page, data, 'save');
  }


  /** Updates a record and verifies both old and new data. */
  async updateData(data: { firstSave: T; updateCase: T }, attributeForGet: string) {
    await this.openNewForm();
    await this.saveData(this.page, data.firstSave, 'save');
    let row = this.getRowByCode(attributeForGet);
    await row.locator('button').first().click();
    await expect(this.page).toHaveURL(/.*edit/);
    await this.masterPage.verifyFormData(data.firstSave);
    await this.saveData(this.page, data.updateCase, 'update');
    row = this.getRowByCode(attributeForGet);
    await row.locator('button').first().click();
    await expect(this.page).toHaveURL(/.*edit/);
    await this.masterPage.verifyFormData(data.updateCase);
  }


  /** Validates duplicate record error handling. */
  async duplicateDataValidation(data: T) {
    await this.openNewForm();
    await this.saveData(this.page, data, 'save');
    await test.step('Open new form', async () => {
      await this.formLayout.clickAdd();
      await expect(this.page).toHaveURL(/.*new/);
    });
    await this.saveData(this.page, data);
    await this.formLayout.clickSaveAndYes();
    await expect(this.page.getByRole('heading', { name: 'Error' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }


  /** Checks validation errors for required fields. */
  async checkValidationError(errors: string[]) {
    await this.formLayout.clickAdd();
    await expect(this.page).toHaveURL(/.*new/);
    await this.masterPage.selectStatusNo('2');
    await this.formLayout.clickSave();
    for (const error of errors) {
      await expect(this.page.locator(`text=${error}`)).toBeVisible();
    }
  }


  /** Deletes a record and verifies removal. */
  async deleteAndVerify(data: T, attributeForGet: string) {
    await this.openNewForm();
    await this.saveData(this.page, data, 'save');
    const row = this.getRowByCode(attributeForGet);
    await expect(row).toHaveCount(1);
    await test.step('Open and delete', async () => {
      await row.locator('button').first().click();
      await expect(this.page).toHaveURL(/.*edit/);
      await this.formLayout.deleteData();
    });
    await test.step('Verify deletion', async () => {
      await expect(this.page).toHaveURL(/.*\/.*-master/);
      // For ItemSubgroupMasterFormData, use itemSubgroupCode
      const code = (data as any).itemSubgroupCode || (data as any).code;
      const checkRow = this.getRowByCode(code);
      await expect(checkRow).toHaveCount(0);
    });
  }

  /** Checks input attributes for a list of fields. */
  async checkFields(fieldsList: any[]) {
    await this.openNewForm();
    for (const field of fieldsList) {
      await checkInputAttributes(this.page, field);
    }
  }
}
