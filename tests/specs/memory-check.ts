import { chromium } from 'playwright';
import { TestConfig } from '../../test.config';
import { LoginPage } from '../../pages/login';
import { FormLayout } from '../../utils/form-layout';
import { HomePage } from '../../pages/home';
import { FormOperation } from '../../utils/form-operation';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');

  for (let i = 0; i < 50; i++) {
    await page.goto('http://localhost:5173/login');
    const config = new TestConfig();
    await page.goto(config.appUrl);

    const loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    const formLayout = new FormLayout(page);
    const homePage = new HomePage(page);

    await homePage.isHomePage();
    await homePage.masterSearch('CCCM');
    // await formOperation.openNewForm();
    await page.waitForTimeout(2000);

    const metrics = await client.send('Performance.getMetrics');
    const jsHeapUsed = metrics.metrics.find((m) => m.name === 'JSHeapUsedSize');
    console.log(`Iteration ${i}: JS Heap Used = ${Math.round(jsHeapUsed.value / 1024 / 1024)} MB`);
  }

  await browser.close();
})();
