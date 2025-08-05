export function getWallet(wallets, accountRef, currencyCode) {
  return wallets?.accounts?.[accountRef]?.currencies?.[currencyCode] ?? null;
}
