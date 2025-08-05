import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import Output from 'components/outputs/OutputNew';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/Icon';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import ProductOptionsForm from './ProductOptionsForm';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { deleteProductOption, getProduct } from '../../util/rehive';
import Spinner from 'components/outputs/Spinner';
import Modal from 'components/layout/Modal';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';
import Hover from 'components/layout/Hover';

export default function ProductOptions(props) {
  const { onSuccess, refreshItem, context } = props;
  const { item = {} } = context;
  const { id: productId, options = [] } = item ?? {};

  const classes = useStyles(props);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newOptions, setNewOptions] = useState(options);
  const fetchProductData = async () => {
    try {
      const sellerId = context?.sellers?.[0]?.id ?? '';
      const response = await getProduct(sellerId, productId);
      setNewOptions(response?.data?.options);
    } catch (error) {
      console.log('Failed to fetch product data');
    }
  };

  const sharedProps = { productId, setEditing, onSuccess, refreshItem };

  async function handleRemove(optionId) {
    setLoading(optionId);
    try {
      const sellerId = context?.sellers?.[0]?.id ?? '';
      await deleteProductOption(sellerId, productId, optionId);
      refreshItem();
      fetchProductData();
    } catch (e) {
      console.log('handleAddVariant -> e', e);
    }
    setLoading(false);
  }

  const tempOption = newOptions[editing];

  return (
    <div className={classes.container}>
      {context?.loading ? (
        <Spinner />
      ) : !newOptions.length ? (
        <EmptyListMessage id="no_options" />
      ) : (
        <>
          <div className={classes.row}>
            <div className={classes.row}>
              <View style={{ width: '40%' }}>
                <Text
                  width={'auto'}
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500"
                  id="label"
                />
              </View>
              <View>
                <Text
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500"
                  id="options"
                />
              </View>
            </div>

            <div style={{ minWidth: 80 }} />
          </div>
          {newOptions.map(({ id, name, values }, index) => (
            <Hover
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                minHeight: 32,
              }}
              render={hover => (
                <div className={classes.row} key={id}>
                  <View w="38%" mt={hover ? 0.15 : 0}>
                    <Text>{name}</Text>
                  </View>
                  <View w="56%" mt={hover ? 0.15 : 0}>
                    <Text>{values.join(', ')}</Text>
                  </View>
                  {hover ? (
                    <>
                      <IconButton
                        onClick={() => setEditing(index)}
                        style={{
                          padding: 4,
                          marginLeft: 12,
                          backgroundColor: 'transparent',
                        }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        loading={loading === id}
                        // tooltip={'Delete'}
                        onClick={() => handleRemove(id)}
                        style={{
                          padding: 4,
                          marginLeft: 12,
                          backgroundColor: 'transparent',
                        }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <div style={{ minWidth: 80 }} />
                  )}
                </div>
              )}
            />
          ))}
        </>
      )}

      <Modal
        title={tempOption ? 'edit_option' : 'add_option'}
        close
        altStyle
        contentId="options_helper_text"
        maxWidth={572}
        open={editing !== null}
        onDismiss={() => setEditing(null)}>
        <PageContent horizontal={3}>
          <ProductOptionsForm
            {...props}
            {...sharedProps}
            edit={Boolean(tempOption)}
            defaultValues={tempOption ?? { name: '', values: [] }}
            fetchProductData={fetchProductData}
          />
        </PageContent>
      </Modal>
      <div className={classes.buttons}>
        <IconButton
          onClick={() => productId && setEditing(true)}
          noPadding
          tooltip={
            !productId ? 'Please save product before adding options' : ''
          }
          disabled={!productId}>
          <Icon
            noMi
            icon="plus"
            size={12.5}
            color={!productId ? 'font' : 'primary'}
          />
        </IconButton>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(1),
    // marginTop: theme.spacing(6),
    // borderRadius: 30,
    // minWidth: 350,
    // border: '1px solid #EFEFEF',
    width: '100%',
    // height: '90%',

    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  arrayContainer: {
    width: '100%',
  },
  arrayRow: {
    width: '100%',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
    paddingTop: theme.spacing(1),
  },
}));
