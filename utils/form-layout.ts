import { Page, Locator, expect } from '@playwright/test';

/**
 * FormLayout handles common form actions for master pages.
 * All button locators are configurable for reuse and maintainability.
 */
export class FormLayout {
  private readonly page: Page;
  private readonly addBtn: Locator;
  private readonly saveBtn: Locator;
  private readonly updateBtn: Locator;
  private readonly deleteBtn: Locator;
  private readonly saveOptionBtn: Locator;
  private readonly cancelBtn: Locator;
  private readonly yesBtn: Locator;
  private readonly noBtn: Locator;
  private readonly okBtn: Locator;
  private readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBtn = page.getByTitle('New item (ctrl + n)');
    this.saveBtn = page.getByRole('button', { name: 'Save', exact: true });
    this.updateBtn = page.getByRole('button', { name: 'Save Changes' });
    this.deleteBtn = page.getByRole('button', { name: 'Delete' });
    this.saveOptionBtn = page.getByLabel('More options');
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.yesBtn = page.getByRole('button', { name: 'Yes' });
    this.noBtn = page.getByRole('button', { name: 'No' });
    this.okBtn = page.getByRole('button', { name: 'OK' });
    this.confirmationHeader = page.getByRole('heading', { name: 'Confirmation' });
  }

  /** Clicks the Add button to open a new form. */
  async clickAdd() {
    await this.addBtn.click();
  }

  /** Clicks the Save button to save changes. */
  async clickSave() {
    await this.saveBtn.click();
  }

  /** Clicks the Update button to update changes. */
  async clickUpdate() {
    await this.updateBtn.click();
  }

  /** Clicks the Save Option button for more options. */
  async clickSaveOption() {
    await this.saveOptionBtn.click();
  }

  /** Clicks the Delete button to delete the record. */
  async clickDelete() {
    await this.deleteBtn.click();
  }

  /** Clicks the Yes button in confirmation dialogs. */
  async clickYes() {
    await this.yesBtn.click();
  }

  /** Clicks the Cancel button. */
  async clickCancel() {
    await this.cancelBtn.click();
  }

  /** Clicks the No button in confirmation dialogs. */
  async clickNo() {
    await this.noBtn.click();
  }

  /** 
   * Clicks the OK button if visible. 
   * @returns true if clicked, false otherwise.
   */
  async clickOkIfVisible(): Promise<boolean> {
    if (await this.okBtn.isVisible()) {
      await this.okBtn.click();
      return true;
    }
    return false;
  }

  /**
   * Clicks the Cancel button if visible.
   */
  async clickCancelIfVisible() {
    if (await this.cancelBtn.isVisible()) {
      await this.cancelBtn.click();
    }
  }

  /**
   * Handles save or update actions and confirmation dialogs.
   * @param mode 'save' or 'update'
   */
  async saveData(mode: 'save' | 'update') {
    if (mode === 'save') {
      await this.clickSave();
    } else {
      await this.clickUpdate();
    }

    try {
      // Wait for confirmation to appear
      await expect(this.confirmationHeader).toBeVisible({ timeout: 5000 });
      await this.clickYes();

      // Use regex to be robust against spacing issues (e.g. 'Successfully  created.')
      const messageRegex = mode === 'save' ? /Successfully\s+created/ : /Successfully\s+updated/;
      await expect(this.page.getByText(messageRegex)).toBeVisible();

      await this.clickCancelIfVisible();
    } catch (error) {
      console.error(`Error in saveData (${mode}):`, error);
      throw error; // Re-throw to fail the test if the flow is broken
    }
  }

  /** 
   * Handles record deletion and confirmation. 
   */
  async deleteData() {
    await this.clickSaveOption();
    await this.clickDelete();

    try {
      if (await this.confirmationHeader.isVisible()) {
        await this.clickYes();
        await this.clickCancelIfVisible();
      }
    } catch (error) {
      console.error('Error in deleteData:', error);
      throw error;
    }
  }
}
