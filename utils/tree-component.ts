import { Page, Locator, expect } from '@playwright/test';

export class TreeCheckboxTester {
  private readonly page: Page;
  private readonly parentLabel: string;
  private readonly parentLabelElement: Locator;
  private readonly childLabelElements: Locator;

  constructor(page: Page, parentLabel: string) {
    this.page = page;
    this.parentLabel = parentLabel;

    this.parentLabelElement = page.locator('label', { hasText: parentLabel });

    this.childLabelElements = this.parentLabelElement
      .locator('xpath=../../following-sibling::div//label');
  }

  async checkParentChecksAllChildren() {
    await this.parentLabelElement.click(); 
    const count = await this.childLabelElements.count();

    for (let i = 0; i < count; i++) {
      const input = this.childLabelElements.nth(i).locator('input[type="checkbox"]');
      await expect(input).toBeChecked();
    } 
    await this.uncheckAll();

  }

  async uncheckParentUnchecksAllChildren() {
    await this.parentLabelElement.click(); 
    const count = await this.childLabelElements.count();

    for (let i = 0; i < count; i++) {
      const input = this.childLabelElements.nth(i).locator('input[type="checkbox"]');
      await expect(input).not.toBeChecked();
    }
    
    await this.uncheckAll();
  }

  async checkAllChildrenCheckParent() {
    const count = await this.childLabelElements.count();
    for (let i = 0; i < count; i++) {
      await this.childLabelElements.nth(i).click(); 
    }

    const parentInput = this.parentLabelElement.locator('input[type="checkbox"]');
    await expect(parentInput).toBeChecked();
    await this.uncheckAll();

  }

  async uncheckOneChildUnchecksParent() {
    const count = await this.childLabelElements.count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      await this.childLabelElements.nth(i).click();
    }

    await this.childLabelElements.first().click();

    const parentInput = this.parentLabelElement.locator('input[type="checkbox"]');
    await expect(parentInput).not.toBeChecked();
    await this.uncheckAll();
  }

  async uncheckAll() {
    
  const parentInput = this.parentLabelElement.locator('input[type="checkbox"]');
  const isChecked = await parentInput.isChecked();
  if (isChecked) {
    await this.parentLabelElement.click();
  }

  const count = await this.childLabelElements.count();
  for (let i = 0; i < count; i++) {
    const childLabel = this.childLabelElements.nth(i);
    const childInput = childLabel.locator('input[type="checkbox"]');
    const checked = await childInput.isChecked();
    if (checked) {
      await childLabel.click();
    }
  }
}



}
