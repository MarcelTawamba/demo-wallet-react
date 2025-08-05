import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { deleteProductVariant, getProduct } from '../../util/rehive';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import ProductVariantsForm from './ProductVariantsForm';
import EditIcon from '@material-ui/icons/Edit';
import Icon from 'components/outputs/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from 'components/layout/Modal';
import PageContent from 'components/layout/page/PageContent';
import Spinner from 'components/outputs/Spinner';
import { View } from 'components/layout/View';
import Hover from 'components/layout/Hover';
import { formatPricesString } from 'util/products';

export default function ProductVariants(props) {
  const { context, refreshItem, onSuccess, showToast } = props;
  const { item = {} } = context;
  const { id: productId, variants = [], options = [] } = item ?? {};
  const classes = useStyles(props);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newOptions, setNewOptions] = useState(options);
  const [newVariants, setNewVariants] = useState(variants);
  const fetchProductsVariations = async () => {
    try {
      const sellerId = context?.sellers?.[0]?.id ?? '';
      const response = await getProduct(sellerId, productId);
      setNewOptions(response?.data?.options);
      setNewVariants(response?.data?.variants);
    } catch (error) {
      console.log('Failed to fetch product data');
    }
  };

  const sharedProps = {
    item,
    productId,
    setEditing,
    options,
    refreshItem,
    onSuccess,
  };

  async function handleRemove(variantId) {
    setLoading(variantId);
    try {
      const sellerId = context?.sellers?.[0]?.id ?? '';
      const resp = await deleteProductVariant(sellerId, productId, variantId);
      if (resp?.status === 'success') {
        showToast({ id: 'variant_delete_success', variant: 'success' });
      } else {
        showToast({ id: 'variant_delete_failed', variant: 'error' });
      }
      fetchProductsVariations();
      refreshItem();
    } catch (e) {
      console.log('handleAddVariant -> e', e);
    }
  }

  return (
    <div className={classes.container}>
      <React.Fragment>
        {context?.loading ? (
          <Spinner />
        ) : !newVariants.length ? (
          <EmptyListMessage id="no_variants" />
        ) : (
          <>
            <div className={classes.row}>
              <View style={{ width: '35%', paddingRight: 16 }}>
                <Text
                  width={'auto'}
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500"
                  id="code_label"
                />
              </View>
              <View fD="row" jC="space-between" w="100%">
                <Text
                  style={{ flex: 1, paddingRight: 16 }}
                  width={'auto'}
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500"
                  id="quantity"
                />
                {newOptions?.map(option => (
                  <Text
                    style={{ flex: 1, paddingRight: 16 }}
                    width={'auto'}
                    variant="caption"
                    myColor={'primary'}
                    fontWeight="500">
                    {option.name}
                  </Text>
                ))}
                <Text
                  style={{ flex: 1 }}
                  width={'auto'}
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500"
                  id="price(s)"
                />
              </View>

              <div style={{ minWidth: 64 }} />
            </div>

            {newVariants.map(
              (
                {
                  id,
                  code,
                  options: variantOptions,
                  label,
                  quantity,
                  prices,
                  tracked,
                },
                index,
              ) => (
                <Hover
                  key={id}
                  style={{
                    width: '100%',
                    minHeight: 32,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  render={hover => (
                    <div className={classes.row} key={id}>
                      {/* <Output
                      label={code + (label ? ' (' + label + ')' : '')}
                      value={formatVariantsString(options)}
                      horizontal
                    /> */}
                      <View style={{ width: '35%', paddingRight: 16 }}>
                        <Text width={'auto'}>
                          {code + (label ? ' (' + label + ')' : '')}
                        </Text>
                      </View>
                      <View fD="row" jC="space-between" w="100%">
                        <Text style={{ flex: 1, paddingRight: 16 }}>
                          {!tracked ? 'Untracked' : quantity}
                        </Text>
                        {options?.map(option => (
                          <Text style={{ flex: 1, paddingRight: 16 }}>
                            {variantOptions?.[option?.name]}
                          </Text>
                        ))}

                        <Text style={{ flex: 1 }}>
                          {formatPricesString(prices)}
                        </Text>
                      </View>

                      {hover ? (
                        <>
                          <IconButton
                            // tooltip={'Edit'}
                            onClick={() => setEditing(index)}
                            style={{
                              padding: 0,
                              marginLeft: 12,
                              maxHeight: 32,
                              backgroundColor: 'transparent',
                            }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            // tooltip={'Delete'}
                            loading={loading === id}
                            onClick={() => handleRemove(id)}
                            style={{
                              padding: 0,
                              marginLeft: 12,
                              backgroundColor: 'transparent',
                            }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <div style={{ minWidth: 64 }} />
                      )}
                    </div>
                  )}
                />
              ),
            )}
          </>
        )}
      </React.Fragment>

      <Modal
        title="add_variant"
        close
        altStyle
        contentId="variants_helper_text"
        maxWidth={572}
        open={editing !== null}
        onDismiss={() => setEditing(null)}>
        <PageContent horizontal={3}>
          <ProductVariantsForm
            {...props}
            optionsLoading={context?.loading ?? false}
            {...sharedProps}
            item={newVariants[editing] ? newVariants[editing] : null}
            fetchProductsVariations={fetchProductsVariations}
          />
        </PageContent>
      </Modal>

      <div className={classes.buttons}>
        <IconButton
          onClick={() => productId && setEditing(true)}
          noPadding
          tooltip={
            !productId ? 'Please save product before adding variants' : ''
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
//
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(1),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  arrayContainer: {
    width: '100%',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
    paddingTop: theme.spacing(1),
  },
}));
