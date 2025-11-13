// tests/setup/login.setup.ts
import { test as setup, expect } from '@playwright/test';
import { TestConfig } from '../../test.config';
import { LoginPage } from '../../pages/login';

const authFile = 'playwright/.auth/state.json';

setup('Authenticate user', async ({ page }) => {
  const config = new TestConfig();
  const loginPage = new LoginPage(page);

  await page.goto(config.appUrl);
  await loginPage.login(config.email, config.password);

  await page.context().storageState({ path: authFile });
});
