import {  test, expect } from '@playwright/test'
import { LoginPage } from '../../../../pages/login'
import { TestConfig } from '../../../../test.config'


let config : TestConfig;
let loginPage : LoginPage;

test.beforeEach( async({ page })=>{
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);

})

test('User Login Test', async ({page})=>{
    await loginPage.setEmail(config.email);
    await loginPage.setPassword(config.password);
    await loginPage.clickLoginButton();
    // const heading = page.getByRole('heading', { name: 'Error' });
    // await expect(heading).toBeVisible();
})