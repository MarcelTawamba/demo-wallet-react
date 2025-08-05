import React, { useState } from 'react';

import { standardizeString } from 'util/general';
import Spinner from 'components/outputs/Spinner';
import Selector from 'components/inputs/Selector';
import { Box } from '@material-ui/core';
import { updateOrder } from '../util/rehive';

export default function StatusUpdate(props) {
  const { status, sellerId, orderId, helpers } = props;
  const { refreshData, showToast } = helpers;
  const options = statusOptions?.[status].map(item => ({
    value: item,
    label: standardizeString(item),
  }));
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status) {
    setLoading(true);
    const resp = await updateOrder(sellerId, orderId, { status });
    if (resp?.status === 'success') {
      showToast({
        text: 'Order status updated: ' + status,
        variant: 'success',
      });
      refreshData();

      let timer = setTimeout(() => {
        setLoading(false);
        return () => clearTimeout(timer);
      }, 2000);
    } else {
      showToast({
        text: 'Unable to update order status: ' + resp?.message,
        variant: 'error',
      });
      setLoading(false);
    }
  }

  return (
    <Box maxWidth={120}>
      {/* <Skeleton height={20} width={110} /> */}
      {loading ? (
        <Spinner size={14} />
      ) : (
        <Selector
          align="right"
          valueBold
          value={status}
          items={options}
          onValueChange={handleStatusChange}
        />
      )}
    </Box>
  );
  // return <Text>{standardizeString(status)}</Text>;
}

const statusOptions = {
  pending: ['complete', 'placed', 'failed'],
  complete: ['failed', 'placed'],
  placed: ['complete', 'failed'],
  failed: ['complete', 'placed'],
};
