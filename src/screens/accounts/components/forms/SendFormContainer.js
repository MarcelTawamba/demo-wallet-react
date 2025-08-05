import React, { useState, useEffect } from 'react';

import SendForm from './SendForm';
import { getStellarKnownPublicAddresses } from 'util/rehive';
import { checkIfStellar } from 'util/crypto';

export default function SendFormContainer(props) {
  const { currency } = props;

  const [knownAddresses, setKnownAddresses] = useState([]);
  useEffect(() => {
    async function fetchData() {
      let resp = await getStellarKnownPublicAddresses();
      if (resp?.status === 'success') {
        setKnownAddresses(resp?.data);
      }
    }
    if (checkIfStellar(currency)) {
      fetchData();
    }
  }, []);

  return <SendForm {...props} knownAddresses={knownAddresses} />;
}
