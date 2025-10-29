import { expect, Locator, Page } from '@playwright/test';

export async function checkTabOrderByFocus(page: Page, expectedFields: Locator[]) {
    if (!expectedFields || expectedFields.length === 0) return;

    await expectedFields[0].click();

    for (let i = 1; i < expectedFields.length; i++) {
        await page.keyboard.press('Tab');
        await expect.soft(expectedFields[i]).toBeFocused();

    }
}
