const { test } = require('@playwright/test');

test('buy test', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'e2e/auth.json' });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/accounts/');
  await page.waitForLoadState('networkidle', { timeout: 120000 });
  const isBusinessAccount =
    (await page.getByTestId('account-card').count()) > 0;
  if (isBusinessAccount) {
    await page
      .getByTestId('account-card')
      .filter({ hasText: 'GENERAL' })
      .click();
  }
  await page.getByTestId('account-currency-menu-card').first().click();
  if (
    (await page
      .getByTestId('action-button')
      .filter({ hasText: 'BUY' })
      .count()) > 0
  ) {
    await page.getByTestId('action-button').filter({ hasText: 'BUY' }).click();
    await page.getByTestId('buy-sell-option-item').first().click();
    await page.getByPlaceholder('0.00').first().fill('5');
    await page.getByRole('button', { name: 'CONTINUE' }).first().click();
    await Promise.all([
      page.waitForResponse(
        resp =>
          resp.url().includes('/user/conversions/') && resp.status() === 201,
      ),
    ]);
    await page.getByRole('button', { name: 'CONFIRM' }).click();
    await Promise.all([
      page.waitForResponse(
        resp =>
          resp.url().includes('/user/conversions/') && resp.status() === 200,
      ),
    ]);
  }
});
