import {  test, expect } from '@playwright/test'
import { SubsrcriberRegistrationPage } from '../../../../pages/subscriber-registeration'
import { TestConfig } from '../../../../test.config'


let config : TestConfig;
let registerationPage : SubsrcriberRegistrationPage;

test.beforeEach( async({ page })=>{
    config = new TestConfig();
    await page.goto(config.registerationUrl);

    registerationPage = new SubsrcriberRegistrationPage(page);

})

test('User Registration Test', async ({page})=>{
    await registerationPage.fillEmail(config.registrationEmail);
    await registerationPage.fillPassword(config.registrationPassword);
    await registerationPage.fillContactPersonName(config.contactPersonName);
    await registerationPage.clickRegisterButton();
    await page.waitForURL(/.*mail-sent/);
   
})