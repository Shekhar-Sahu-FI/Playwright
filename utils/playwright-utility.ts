// utils/form-test-setup.ts
import { Page, expect } from '@playwright/test';
import { TestConfig } from '../test.config';
import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';
import { FormLayout } from './form-layout';
import { FormOperation } from './form-operation';

/**
 * Reusable test setup for Master Forms.
 * Logs in, navigates to target master, initializes page objects.
 *
 * @param page Playwright Page instance
 * @param masterCode Menu/master code for navigation (e.g., 'MMSG' for Item Subgroup)
 * @param MasterPageClass Page Object class for the master
 * @param SaveData Function to handle form filling and saving
 * @returns Initialized objects { config, formLayout, homePage, masterPage, formOperation }
 */

export async function setupMasterForm<T>(
  page: Page,
  masterCode: string,
  MasterPageClass: new (page: Page) => any,
  SaveData: (page: Page, data: T, mode?: 'save' | 'update' | '') => Promise<void>,
) {
  const config = new TestConfig();
  await page.goto(config.appUrl);

  const loginPage = new LoginPage(page);
  await loginPage.login(config.email, config.password);

  const formLayout = new FormLayout(page);

  const homePage = new HomePage(page);
  await homePage.isHomePage();
  await homePage.masterSearch(masterCode);

  const masterPage = new MasterPageClass(page);
  // await expect(page).toHaveURL(new RegExp(masterCode, "i"));

  const formOperation = new FormOperation(page, formLayout, SaveData, masterPage);

  return {
    config,
    loginPage,
    homePage,
    formLayout,
    masterPage,
    formOperation,
  };
}
