const { test } = require('@playwright/test');

test('send test', async ({ browser }) => {
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
  await page.getByRole('button', { name: 'SEND', exact: true }).click();
  await page.getByPlaceholder('0.00').fill('5');
  await page.getByPlaceholder('Email or mobile').fill('samiul+c2@rehive.com');
  await page.getByPlaceholder('e.g. Payment').fill('test send note');
  await page.locator('form').getByRole('button', { name: 'SEND' }).click();
  await page.getByRole('button', { name: 'CONFIRM' }).click();
  await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/transactions/transfer/') && resp.status() === 201,
    ),
  ]);
});
