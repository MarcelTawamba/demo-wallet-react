const cryptoExplorerLink = ({ metadata }) => {
  if (metadata && metadata.type) {
    switch (metadata.type) {
      case 'stellar':
        return 'http://stellarchain.io/tx/' + metadata.hash;
      case 'bitcoin':
        return 'https://live.blockcypher.com/btc-testnet/tx/' + metadata.hash;
      case 'ethereum':
        return 'https://etherscan.io/tx/' + metadata.hash;
      default:
        return '';
    }
  }
  return '';
};

export default cryptoExplorerLink;
