import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from 'components/inputs/Button';
import { createSeller } from 'screens/products_admin/util/rehive';
import Text from 'components/outputs/Text';
import ErrorOutput from 'components/outputs/Error';
import Spinner from 'components/outputs/Spinner';
import Status from 'components/outputs/Status';

export default function EnableSeller(props) {
  const {
    context = {},
    field: { sellers, setSellers },
  } = props;

  const { business } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [sellers, setSellers] = useState(null);

  async function handleEnableSeller() {
    if (business?.id) {
      setLoading(true);
      setError(null);

      const resp = await createSeller({
        id: business?.id,
        name: business?.name,
        description: business?.description,
        account: business?.account,
      });

      if (resp.status === 'success') setSellers([resp?.data]);
      else setError(resp?.message);
    } else setError('Unable to find business');

    setLoading(false);
  }
  const classes = useStyles();

  // async function fetchData() {
  //   const resp = await getSellers();
  //   if (resp.status === 'success') {
  //     setSellers(resp?.data?.results);
  //   } else {
  //     setError('Unable to fetch sellers');
  //   }
  //   setLoading(false);
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const hasSeller = sellers?.length;

  return (
    <>
      {loading ? (
        <Spinner size={28} p={1} />
      ) : (
        <div className={classes.row}>
          <Text id="enable_seller" />
          {sellers?.length ? (
            <Status noWrap={false}>Verified</Status>
          ) : (
            <Button
              noPadding
              noMargin
              variant="text"
              size="small"
              color="primary"
              label="Enable"
              loading={loading === 'submit'}
              onClick={handleEnableSeller}
            />
          )}
        </div>
      )}
      <ErrorOutput>{error}</ErrorOutput>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 44,
  },
}));
