import { Locator, Page, test } from '@playwright/test';



export const getRowByCode = (code: string, page: Page): Locator => {
    return page.locator('tr', {
        has: page.locator(`td:has-text("${code}")`),
    });
}


