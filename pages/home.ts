import { Page, Locator, expect } from '@playwright/test';

export class HomePage{

    private readonly page: Page;
    private readonly heading : Locator;
    private readonly search : Locator;
    private readonly menuIcon : Locator;
    private readonly avatar : Locator;
    private readonly organization : Locator;

    constructor( page: Page){
        this.page = page;

        this.heading = page.getByRole('heading', { name: 'Welcome to ARPA ERP' });
        this.search = page.getByPlaceholder("Search...");
        this.menuIcon = page.locator('[name="menuIcon"]');
        this.avatar = page.locator('[name="avatar"]');
        this.organization = page.locator('[name="organizationBtn"]');
    }

    async isHomePage(){
        await this.heading.isVisible();
        await expect(this.page).toHaveURL(/.*dashboard/);
    }

    async masterSearch( code : string){
        await this.search.fill(code);
        await this.page.keyboard.press('Enter');
    }

    async clickAvatar (){
        await this.avatar.click();
    }

    async clickOrganization(){
        await this.organization.click();
    }

    async geToMaster(module: string, subModule: string, page: string){
        await this.menuIcon.click();
        await this.page.locator(`[id="${module}"]`).click();
        await this.page.locator(`[name="${subModule}"]`).hover();
        await this.page.getByText(page).click();
    }
}

    
