import React, { useState, useEffect } from 'react';
import OutOfAppScreen from 'components/layout/OutOfAppScreen';
import { useSelector } from 'react-redux';
import FullScreenButtonSelector from 'components/inputs/FullScreenButtonSelector';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { isEmpty } from 'lodash';

/* components */
export default function PointOfSalePage(props) {
  const { context, loadingContext } = props;
  const { company, seller, business } = context;
  const wallets = useSelector(walletsSelector);
  const { icon } = company;
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    if (!loadingContext && !isEmpty(business) && !isEmpty(wallets)) {
      let _buttons = [];
      if (business?.id && wallets?.accountsDictionary?.sales)
        _buttons.push({
          id: 'sales',
          label: 'create_new_sale',
          icon: 'sale',
        });

      if (seller)
        _buttons.push({
          id: 'redeem_voucher',
          label: 'redeem_voucher',
          icon: 'products',
        });
      _buttons.push({
        id: 'qr',
        label: 'print_qr',
        icon: 'qr',
      });

      const hasTellarAccount = Boolean(wallets?.accountsDictionary?.teller);
      if (hasTellarAccount) {
        _buttons.unshift({
          id: 'top_up',
          label: 'top_up_user_balance',
        });
      }
      setButtons(_buttons);
    }
  }, [business, wallets, seller, loadingContext]);

  return (
    <OutOfAppScreen
      center
      onBack={'/accounts/'}
      backLabel="back_to_web_app"
      icon={icon}>
      <FullScreenButtonSelector title="welcome" items={buttons} base="pos" />
    </OutOfAppScreen>
  );
}
