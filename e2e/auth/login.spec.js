const { test } = require('@playwright/test');

test('rehive sign in test', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // ENTER TO APP/COMPANY
  await page.goto('http://localhost:3000/');
  const companyId = process.env.TEST_COMPANY_ID ?? 'e2e_test';
  await page.getByPlaceholder('App ID').fill(companyId);
  await page.getByRole('button', { name: 'JOIN' }).click();
  await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/public/company/?company_id=') &&
        resp.status() === 200,
    ),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 120000 });
  const sliderSkipButton = page
    .locator('#root div')
    .filter({ hasText: 'Skip' })
    .nth(3);
  if (await sliderSkipButton.count()) {
    await sliderSkipButton.click();
  }

  // LOG IN
  await page.getByRole('button', { name: 'LOG IN' }).click();
  const email = process.env.TEST_COMPANY_USER_EMAIL ?? 'samiul+b1@rehive.com';
  const password = process.env.TEST_COMPANY_USER_PASSWORD ?? 'bs123456';
  await page.getByPlaceholder('e.g. hello@gmail.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'LOG IN' }).click();
  await Promise.all([
    page.waitForResponse(
      resp => resp.url().includes('/auth/login/') && resp.status() === 200,
    ),
  ]);
  await Promise.all([
    page.waitForResponse(
      resp => resp.url().includes('/user/') && resp.status() === 200,
    ),
  ]);
  await page.waitForTimeout(2000);
  // Save storage state into the file.
  await context.storageState({ path: 'e2e/auth.json' });
});
