import { expect, Locator, Page, test } from '@playwright/test';
import { FormLayout } from './form-layout';

/**
 * A reusable utility class that handles common CRUD and validation operations
 * for all Master forms in the application.
 *
 * @template T - Type of data object (form data model)
 */
export class FormOperation<T = Record<string, any>> {
  private readonly page: Page;
  private readonly formLayout: FormLayout;
  private readonly masterPage: {
    verifyFormData: (data: T) => Promise<void>;
    selectStatusNo: (status: string) => Promise<void>;
  };
  private readonly saveDataFn: (page: Page, data: T, mode?: 'save' | 'update' | '') => Promise<void>;

  constructor(
    page: Page,
    formLayout: FormLayout,
    saveData: (page: Page, data: T, mode?: 'save' | 'update' | '') => Promise<void>,
    masterPage: { verifyFormData: (data: T) => Promise<void>; selectStatusNo: (status: string) => Promise<void> },
  ) {
    this.page = page;
    this.formLayout = formLayout;
    this.masterPage = masterPage;
    this.saveDataFn = saveData;
  }

  /** Opens a new form and verifies navigation to `/new` route. */
  async openNewForm() {
    await test.step('Open a new form', async () => {
      await this.formLayout.clickAdd();
      await expect(this.page).toHaveURL(/.*new/, { timeout: 10000 });
    });
  }

  /** Locates a table row matching the provided `code` value. */
  getRowByCode(code: string) {
    const dropdown = this.page.locator('select');
    dropdown.selectOption('100');
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }
  async getRowByCodeAcrossPages(code: string) {
    // Set maximum rows per page
    await this.page.locator('select:has(option[value="100"])').selectOption('100');

    // Locators for pagination
    const nextBtn = this.page
      .locator('button >> svg[path*="18 6-6-6"]') // selects the right arrow icon (next)
      .locator('xpath=ancestor::button'); // get parent button

    while (true) {
      // Step 1: Try to find the row on current page
      const row = this.page.locator('tr', {
        has: this.page.locator(`td >> text=${code}`),
      });

      if ((await row.count()) > 0) {
        return row; // Found on this page
      }

      // Step 2: If Next Page button is disabled, break
      if (await nextBtn.isDisabled()) {
        break;
      }

      // Step 3: Go to next page
      await nextBtn.click();

      // Wait for table to reload
      await this.page.waitForLoadState('networkidle');
    }

    // If reached here, code not found
    // return null;
  }

  /** Creates and saves a new record, verifying the save operation. */
  async saveAndVerify(data: T) {
    await test.step('Create and save new record', async () => {
      await this.openNewForm();
      await this.saveDataFn(this.page, data, 'save');
    });
  }

  /**
   * Updates an existing record:
   * 1. Creates an initial record.
   * 2. Opens record for editing.
   * 3. Verifies old data.
   * 4. Updates and re-verifies new data.
   */
  async updateData(data: { firstSave: T; updateCase: T }, identifier: string) {
    await test.step('Update existing record', async () => {
      await this.openNewForm();
      await this.saveDataFn(this.page, data.firstSave);

      const row = await this.getRowByCodeAcrossPages(identifier);

      // Validate existence
      await expect(row, `Row with code ${identifier} not found`).not.toBeNull();
      await expect(row!).toHaveCount(1, { timeout: 10000 });

      await row!.locator('button').first().click();
      await expect(this.page).toHaveURL(/.*edit/, { timeout: 10000 });

      await this.masterPage.verifyFormData(data.firstSave);
      await this.saveDataFn(this.page, data.updateCase, 'update');

      // Verify update success
      const updatedRow = this.getRowByCodeAcrossPages(identifier);
      await updatedRow.locator('button').first().click();
      await expect(this.page).toHaveURL(/.*edit/, { timeout: 10000 });
      await this.masterPage.verifyFormData(data.updateCase);
    });
  }

  /**
   * Validates duplicate entry error handling.
   * Ensures the system prevents saving two identical records.
   */
  async duplicateDataValidation(data: T) {
    await test.step('Validate duplicate entry restriction', async () => {
      await this.openNewForm();
      await this.saveDataFn(this.page, data, 'save');

      await this.openNewForm();
      await this.saveDataFn(this.page, data);

      await this.formLayout.clickSaveAndYes();

      const errorDialog = this.page.getByRole('heading', { name: 'Error' });
      await expect(errorDialog).toBeVisible({ timeout: 8000 });

      await this.page.getByRole('button', { name: 'OK' }).click();
    });
  }

  /**
   * Checks mandatory field validations by leaving required inputs blank
   * and verifying that corresponding error messages appear.
   */
  // async checkValidationError(expectedErrors: string[]) {
  //   await test.step('Check mandatory field validations', async () => {
  //     await this.openNewForm();
  //     await this.masterPage.selectStatusNo('2'); // force validation state
  //     await this.formLayout.clickSave();

  //     for (const message of expectedErrors) {
  //       await expect.soft(this.page.locator(`text=${message}`)).toBeVisible({
  //         timeout: 5000,
  //       });
  //     }
  //   });
  // }
  async checkValidationError(expectedErrors: string[]) {
    await test.step('Check mandatory field validations', async () => {
      await this.openNewForm();
      await this.masterPage.selectStatusNo('2'); // trigger validation
      await this.formLayout.clickSave();

      for (const message of expectedErrors) {
        const locator = this.page.locator(`text=${message}`);
        try {
          await expect.soft(locator, `Validation message of: "${message}"`).toBeVisible({ timeout: 5000 });
        } catch (error) {
          console.error(`Validation failed for message: "${message}"`);
          console.error(`Locator not found or timed out for "${message}"`);
          throw error; // optional: keep or remove depending on desired behavior
        }
      }
    });
  }

  /**
   * Deletes a record and confirms it no longer exists in the listing.
   * Supports master forms that use a delete confirmation dialog.
   */
  async deleteAndVerify(data: T, identifier: string) {
    await test.step('Delete and verify record removal', async () => {
      await this.openNewForm();
      await this.saveDataFn(this.page, data, 'save');

      const row = this.getRowByCode(identifier);
      await expect(row).toHaveCount(1, { timeout: 8000 });

      await row.locator('button').first().click();
      await expect(this.page).toHaveURL(/.*edit/, { timeout: 10000 });

      await this.formLayout.deleteData();

      await expect(this.page).toHaveURL(/.*-master/, { timeout: 10000 });

      const recordCode = (data as any).itemSubgroupCode || (data as any).code;
      const deletedRow = this.getRowByCode(recordCode);
      await expect(deletedRow).toHaveCount(0);
    });
  }
}
