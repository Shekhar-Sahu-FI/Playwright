import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common locators
  protected get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading-spinner"]');
  }

  protected get errorMessage(): Locator {
    return this.page.locator('[data-testid="error-message"]');
  }

  protected get successMessage(): Locator {
    return this.page.locator('[data-testid="success-message"]');
  }

  // Common actions
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForElementToBeVisible(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForElementToBeHidden(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async clickElement(selector: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.page.click(selector, options);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  // Common assertions
  async expectElementToBeVisible(selector: string, timeout: number = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  async expectElementToBeHidden(selector: string, timeout: number = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  async expectElementToHaveText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  async expectElementToHaveValue(selector: string, value: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  async expectElementToBeEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled();
  }

  async expectElementToBeDisabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled();
  }

  // Navigation helpers
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForURL('**/*');
    await this.waitForPageLoad();
  }

  // Form helpers
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await this.fillInput(selector, value);
    }
  }

  async clearForm(selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await this.page.fill(selector, '');
    }
  }

  // Screenshot helpers
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}_${Date.now()}.png`,
      fullPage: true 
    });
  }

  // Error handling
  async handleError(error: Error, context: string): Promise<void> {
    console.error(`Error in ${context}:`, error);
    await this.takeScreenshot(`error_${context}_${Date.now()}`);
    throw error;
  }

  // Retry mechanism
  async retryAction<T>(
    action: () => Promise<T>, 
    maxRetries: number = 3, 
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        await this.page.waitForTimeout(delay * attempt);
      }
    }
    
    throw lastError!;
  }

  // Abstract methods that must be implemented by child classes
  abstract isPageLoaded(): Promise<boolean>;
  abstract getPageTitle(): Promise<string>;
}
