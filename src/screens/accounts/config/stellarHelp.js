const stellarHelp = [
  {
    id: 0,
    title: 'What is a MEMO?',
    description:
      'If you’re sending funds to a Stellar Address, it is important to include a MEMO if the recipient requires a MEMO. The MEMO acts as an important reference for the receiving party to detect any incoming payments and or deposits for crediting your balance. \n\n If you do not include a MEMO when it is required by the recipient, you can lose your funds.',
  },
  {
    id: 1,
    title: 'What is a Federation Address?',
    description:
      'Stellar makes it easy for third party wallet providers to embed the MEMO in a human readable address format, similar to that of an email address. The only difference is that the @ symbol is replaced with a * symbol, e.g.\n\nusername*domain.com\n\nIt is important to make sure that you are sending funds to a valid federated address.  ',
  },
  {
    id: 2,
    title: 'How do on chain transactions work?',
    description:
      'If you’re sending funds to a Stellar Address it means that the transaction will be broadcasted to the Stellar Network.\n\nThere is usually a small network fee in XLM that will either be passed on to you as the user, or be absorbed by the organization.\n\nYou’ll be notified if the fee will be applied to your XLM account or not.\n\nYou’ll also be able to copy and/or click on the transaction hash to view the transaction chain details after it is broadcasted to the network.\n\nIt is important to note that on chain transactions can’t be reversed.',
  },
];

export default stellarHelp;
