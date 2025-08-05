import StellarSdk from 'stellar-sdk';

export async function hasStellarTrustline(
  address,
  asset_code,
  asset_issuer,
  testnet,
) {
  const server = new StellarSdk.Server(
    'https://horizon' + (testnet ? '-testnet' : '') + '.stellar.org',
  );
  var stellar_address = address;
  let account = null;
  // If the address is a federation address, first convert to normal address:
  if (address.includes('*')) {
    stellar_address = (
      await StellarSdk.FederationServer.resolve('michail*keybase.io')
    )?.account_id;
  }
  try {
    account = await server.loadAccount(stellar_address);
  } catch (e) {
    console.log('e', e);
  }
  if (!account) {
    return false;
  }
  return (
    account?.balances?.findIndex(
      item =>
        item.asset_type !== 'native' &&
        item.asset_code === asset_code &&
        item.asset_issuer === asset_issuer,
    ) !== -1
  );
}
