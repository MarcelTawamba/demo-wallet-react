const { test } = require('@playwright/test');

test('new request test', async ({ browser }) => {
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
  await page
    .getByTestId('action-button')
    .filter({ hasText: 'REQUEST' })
    .click();
  await page.getByRole('tab', { name: 'New Request' }).click();
  await page.getByPlaceholder('0.00').fill('7');
  await page.getByPlaceholder('Email or mobile').fill('samiul+2@rehive.com');
  const [reasonField, noteField, reasonCapitalField] = await Promise.all([
    page.getByLabel('Reason'),
    page.getByLabel('reason'),
    page.getByLabel('Note'),
  ]);
  const finalNoteField = reasonCapitalField ?? reasonField ?? noteField;
  finalNoteField.fill('test request message');
  // await page.getByLabel('Note' ?? 'reason').fill('test request message');
  // await page.getByTestId('note-field').fill('test request message');
  await page.locator('form').getByRole('button', { name: 'REQUEST' }).click();
  await page.getByRole('button', { name: 'CONFIRM' }).click();
  await Promise.all([
    page.waitForResponse(
      resp => resp.url().includes('/user/requests/') && resp.status() === 201,
    ),
  ]);
});
