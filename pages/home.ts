import { Page, Locator, expect } from '@playwright/test';

export class HomePage {

    private readonly page: Page;
    private readonly heading: Locator;
    private readonly search: Locator;
    private readonly menuIcon: Locator;
    private readonly avatar: Locator;
    private readonly organization: Locator;

    constructor(page: Page) {
        this.page = page;

        this.heading = page.getByRole('heading', { name: 'Welcome to ARPA ERP' });
        this.search = page.getByPlaceholder("Search...");
        this.menuIcon = page.locator('[name="menuIcon"]');
        this.avatar = page.locator('[name="avatar"]');
        this.organization = page.locator('[name="organizationBtn"]');
    }

    async isHomePage() {
        await this.heading.isVisible();
        await expect(this.page).toHaveURL(/.*dashboard/);
    }

    async masterSearch(code: string) {
        await this.search.fill(code);
        await this.page.keyboard.press('Enter');
    }

    async clickAvatar() {
        await this.avatar.click();
    }

    async clickOrganization() {
        await this.organization.click();
    }

    async goToForm(module: string, subModule: string, form: string, page: Page) {
        const firstButton = page.locator('header button').first();
        await firstButton.click();

        const moduleButton = page.getByText(module, { exact: true });

        await moduleButton.waitFor({ state: 'visible' });
        await moduleButton.click();

        const sidebar = page.locator('aside');
        const menuButton = sidebar.getByRole('button').first();
        await menuButton.click();

        const subModuleButton = page.getByText(subModule, { exact: true });
        await subModuleButton.waitFor({ state: 'visible' });
        await subModuleButton.click();

        const formButton = page.getByText(form, { exact: true });
        await formButton.waitFor({ state: 'visible' });
        await formButton.click();
        await menuButton.click();
    }
}


