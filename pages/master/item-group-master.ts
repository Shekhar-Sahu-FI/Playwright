import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';
import { fillWithRetry, selectFromAutoSuggestion } from '../../utils/field-utillity';

export class ItemGroupMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly groupName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly groupNameError: Locator;
  private readonly confirmationHeader: Locator;
  private readonly category: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="itemGroupCode"]');
    this.groupName = page.locator('[name="itemGroupName"]');
    this.category = page.getByPlaceholder('E.g. - Welding Consumables');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.confirmationHeader = page.getByRole('heading', { name: 'Confirmation' });
    this.codeError = page.getByText('Duplicate Code is not allowed');
    this.groupNameError = page.getByText('Duplicate Item Item Group Name is not allowed.');
  }

  async isItemGroupMasterPage() {
    // Ideally check unique elements, or URL
    await expect(this.page).toHaveURL(/.*item-group-master/);
  }

  async fillCode(code: string) {
    await fillWithRetry(this.code, code);
  }

  async fillGroupName(groupName: string) {
    await fillWithRetry(this.groupName, groupName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
    await expect(this.statusNo).toHaveValue(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await fillWithRetry(this.statusRemarks, statusRemarks);
  }

  async fillCategory(query: string, category: string) {
    // Fixed: Now using arguments instead of hardcoded strings
    await selectFromAutoSuggestion(this.page, this.category, query, category);
  }

  async clickAdvanceSearch() {
    // Locating button relative to the input field's container
    // Ideally this would have a unique ID or consistent attribute
    const parent = this.page.locator('div', {
      has: this.category,
    });
    await parent.locator('button[title="Advance Search"]').click();
  }

  async selectCategory(categoryName: string) {
    await this.clickAdvanceSearch();
    // Assuming '100' is a page size or filter. Optimizing locator:
    // Ideally avoid magic values like '100' unless it's constant config
    await this.page.locator('select').filter({ hasText: '10' }).first().selectOption('100'); 

    // Find the row with the category name
    const targetRow = this.page.locator('tr')
      .filter({ has: this.page.getByText(categoryName, { exact: true }) });
      
    await targetRow.locator('label:has(input[type="radio"])').click();

    await this.formLayout.clickOkIfVisible();
    
    // Ensure the selection propagated
    // Using a regex or non-empty check for code value
    await expect(this.code).toHaveValue(/.+/); 
  }

  /**
   * Helper to select a suggestion from a specific table cell.
   * If this was intended for the 'Advance Search' table, standard locators are better.
   */
  async selectSuggestion(name: string) {
    const suggestion = this.page.getByRole('cell', { name: name, exact: true });
    await expect(suggestion).toBeVisible({ timeout: 6000 });
    await suggestion.click();
  }

  async fillItemGroupMasterForm(data: any) {
    await this.fillCode(data.code);
    await this.fillGroupName(data.name);
    await this.selectStatusNo(data.status);
    
    // Correct usage of data properties
    await this.fillCategory(data.categoryQuery || 'cat', data.category || data.categoryName); 

    if (data.statusRemarks && data.status === '2') {
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData('save');
  }

  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.groupNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator('td', { hasText: code }),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.groupName).toHaveValue(data.name);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
