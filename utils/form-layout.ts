import { Page, Locator, expect } from "@playwright/test";


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
  private readonly confirmation: Locator;
  private readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveBtn = page.getByRole("button", { name: "Save Changes" });
    this.updateBtn = page.getByRole('button', { name: 'Save' });
    this.addBtn = page.locator('[title="New item (ctrl + n)"]');
    this.deleteBtn = page.locator("button", { hasText: "Delete" });
    this.saveOptionBtn = page.locator('[aria-label="More options"]');
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.yesBtn = page.locator("button", { hasText: "Yes" });
    this.noBtn = page.locator("button", { hasText: "No" });
    this.confirmation = page.getByRole("heading", { name: "Confirmation" });
    this.error = page.getByRole("heading", { name: "Confirmation" });
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
   * Handles save or update actions and confirmation dialogs.
   * @param mode 'save' or 'update'
   */
  async saveData(mode: 'save' | 'update') {
    if (mode === 'save') {
      await this.clickSave();
    } else if (mode === 'update') {
      await this.clickUpdate();
      console.log("Update Clicked");
    }
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
        const message = mode === 'save' ? 'Successfully  created.' : 'Successfully  updated.';
        await expect(this.page.getByText(message)).toBeVisible();
        await this.cancelBtn.click();
      }
    } catch (err) {
      console.error("Confirmation not found or error occurred", err);
    }
  }


  /** Clicks Save and Yes for confirmation. */
  async clickSaveAndYes() {
    await this.clickSave();
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
      }
    } catch (err) {
      console.error("Confirmation not found or error occurred", err);
    }
  }


  /** Handles record deletion and confirmation. */
  async deleteData() {
    await this.clickSaveOption();
    await this.clickDelete();
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
        await this.cancelBtn.click();
      }
    } catch (err) {
      console.error("Confirmation not found or error occurred", err);
    }
  }

}
