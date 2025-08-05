import React, { useEffect } from 'react';
import FullScreenButtonSelector from 'components/inputs/FullScreenButtonSelector';

/* components */
export default function SaleTypeSelector(props) {
  const { setItems } = props;
  useEffect(() => {
    setItems({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttons = [
    {
      id: 'custom',
      to: '/pos/sales/custom/',
    },
    {
      id: 'products',
      to: '/pos/sales/products/',
    },
  ];

  return (
    <FullScreenButtonSelector title="select_type_of_sale" items={buttons} />
  );
}
