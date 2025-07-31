import { Page, Locator, expect } from "@playwright/test";

export class FormLayout {
  private readonly page: Page;
  private readonly addBtn: Locator;
  private readonly saveBtn: Locator;
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
    this.addBtn = page.locator('[title="New item (ctrl + n)"]');
    this.deleteBtn = page.locator("#DeleteBtn");
    this.saveOptionBtn = page.locator("#SaveOptionBtn");
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.yesBtn = page.locator("button", { hasText: "Yes" });
    this.noBtn = page.locator("button", { hasText: "No" });
    this.confirmation = page.getByRole("heading", { name: "Confirmation" });
    this.error = page.getByRole("heading", { name: "Confirmation" });
  }

  async clickAdd() {
    await this.addBtn.click();
  }
  async clickSave() {
    await this.saveBtn.click();
  }

  async clickSaveOption() {
    await this.saveOptionBtn.click();
  }

  async clickDelete() {
    await this.deleteBtn.click();
  }

  async clickYes() {
    await this.yesBtn.click();
  }
  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickNo() {
    await this.noBtn.click();
  }

  async saveData(mode : string) {
    await this.clickSave();
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
        let message = mode === 'save' ? 'Successfully  created.' : 'Successfully  updated.'
        await expect(this.page.getByText(message)).toBeVisible();
        await this.cancelBtn.click();
      }
    } catch (err) {
      console.log("Confirmation not found or error occurred", err);
    }
  }

  async clickSaveAndYes(){
    await this.clickSave();
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
      }
    } catch (err) {
      console.log("Confirmation not found or error occurred", err);
    }
  }

  async deleteData() {
    await this.clickSaveOption();
    await this.clickDelete();
    try {
      if (await this.confirmation.isVisible()) {
        await this.clickYes();
      //  this.page.waitForSelector()
        await this.cancelBtn.click();
      }
    } catch (err) {
      console.log("Confirmation not found or error occurred", err);
    }
  }


  
}
