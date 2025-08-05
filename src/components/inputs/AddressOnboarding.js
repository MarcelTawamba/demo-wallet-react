import React, { useEffect, useState } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useAddressesFetch } from 'hooks/addressAPI';
import { ListItem } from '@material-ui/core';
import { concatAddress, getValue } from 'util/general';
import RadioSelector from './RadioSelector';
import { Basic, Country } from './Input';
import * as inputConfigs from 'config/inputs';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import Icon from 'components/outputs/Icon';
import Modal from 'components/layout/Modal';
import { deleteItem, updateItem } from 'util/rehive';
import { showToast } from 'components/outputs/Toast';
import { STATUS_COLORS } from './OnboardingDocumentUpload';

export default function AddressOnboarding(props) {
  let { setFieldValue, values, user, InputLabelProps, context } = props;
  const { onPrevious, activeTierSubRequirement } = context;
  const { refetch: refetchUserAddress, data: userAddresses } =
    useAddressesFetch(user?.id);
  const { t } = useTranslation(['common']);
  const [addAddress, setAddAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [currentAddressEdit, setCurrentAddressEdit] = useState(null);

  const openModal = address => {
    setCurrentAddress({ address });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    refetchUserAddress();
  };

  const openEditModal = address => {
    setCurrentAddressEdit({ address });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    refetchUserAddress();
  };
  const allAddressesInvalid = userAddresses?.every(address =>
    ['declined', 'obsolete', 'incomplete'].includes(address?.status),
  );

  return (
    <>
      <View mb={1} w={'100%'}>
        {/* {userAddresses?.length > 0 && <Text bold>Existing addresses</Text>} */}
        {userAddresses?.map((address, index) => (
          <ListItem key={index} style={{ paddingLeft: 0, paddingRight: 8 }}>
            <View
              fD={'row'}
              jC={'space-between'}
              aI={'center'}
              w={'100%'}
              bC={'#f9f9f9'}
              pt={0.5}
              pb={0.5}
              pr={1}
              bR={6}
              pl={1}>
              <View fD={'column'} jC={'flex-start'}>
                <Text
                  id={`Address: ${concatAddress(address)}`}
                  s={14}
                  style={{ width: '85%' }}
                />
                <View
                  fD={'row'}
                  jC={'flex-start'}
                  aI={'center'}
                  w={'100%'}
                  gap={2}>
                  {address?.status === 'pending' && (
                    <Button
                      variant="link"
                      color="primary"
                      id="edit"
                      style={{ marginTop: 8 }}
                      textStyle={{ fontSize: 14 }}
                      onClick={() => openEditModal(address)}
                    />
                  )}
                  {/* {address?.status === 'pending' && ( */}
                  <Button
                    variant="link"
                    color="primary"
                    id="remove"
                    style={{ marginTop: 8 }}
                    textStyle={{ fontSize: 14 }}
                    onClick={() => openModal(address)}
                  />
                  {/* )} */}
                </View>
              </View>
              <label
                className="MuiButton-root"
                style={{
                  color:
                    address.status === 'pending'
                      ? '#a2a2a2'
                      : `${STATUS_COLORS[address.status]}`,
                  // border: `2px solid ${
                  //   address.status === 'pending'
                  //     ? '#a2a2a2'
                  //     : `${STATUS_COLORS[address.status]}`
                  // }`,
                  // padding: '4px 14px',
                  padding: 0,
                  backgroundColor: STATUS_COLORS[`${address.status}Bg`],
                  borderRadius: 100,
                  width: 80,
                  fontSize: 11,
                  textAlign: 'center',
                }}>
                {address.status}
              </label>
            </View>
          </ListItem>
        ))}
        {userAddresses?.length > 0 && !addAddress && allAddressesInvalid ? (
          <Button
            noPadding={true}
            style={{
              // paddingRight: 24,
              paddingLeft: 0,
            }}
            startIcon={
              <Icon
                icon="add"
                size={20}
                style={{
                  background: 'transparent',
                  margin: 0,
                  paddingLeft: 0,
                }}
              />
            }
            variant="text"
            color="primary"
            capitalize={false}
            id="addresses_new"
            onClick={() => setAddAddress(!addAddress)}
          />
        ) : null}
      </View>

      {((userAddresses?.length > 0 && addAddress) ||
        userAddresses?.length === 0) && (
        <View w="100%">
          {activeTierSubRequirement &&
            !activeTierSubRequirement?.isDocumentSelection && (
              <Button
                id={'back_to_all_sections'}
                onClick={onPrevious}
                style={{
                  padding: 0,
                  margin: 0,
                }}
                variant={'text'}
                color="primary"
                // disabled={isSubmitting || isPreviousDisabled}
                noPadding
              />
            )}
          <RadioSelector
            responsive
            items={[]}
            value={values?.address?.type}
            handleChange={event =>
              setFieldValue('address', {
                ...values?.address,
                type: event.target.value,
              })
            }
          />
          <Basic
            onChange={event =>
              setFieldValue('address', {
                ...values?.address,
                line_1: event.target.value,
              })
            }
            value={values?.address?.line_1}
            {...inputConfigs.line_1}
            label={t(inputConfigs.line_1.label)}
            required
            InputLabelProps={InputLabelProps}
          />
          <Basic
            onChange={event =>
              setFieldValue('address', {
                ...values?.address,
                line_2: event.target.value,
              })
            }
            value={values?.address?.line_2}
            {...inputConfigs.line_2}
            label={t(inputConfigs.line_2.label)}
          />
          <Basic
            onChange={event =>
              setFieldValue('address', {
                ...values?.address,
                city: event.target.value,
              })
            }
            value={values?.address?.city}
            {...inputConfigs.city}
            label={t(inputConfigs.city.label)}
            required
            InputLabelProps={InputLabelProps}
          />
          <Basic
            onChange={event =>
              setFieldValue('address', {
                ...values?.address,
                state_province: event.target.value,
              })
            }
            value={values?.address?.state_province}
            {...inputConfigs.state_province}
            label={t(inputConfigs.state_province.label)}
            InputLabelProps={InputLabelProps}
            required
          />
          <Country
            required
            InputLabelProps={InputLabelProps}
            returnCode
            name="country"
            value={values?.address?.country ?? ''}
            setFieldValue={(fieldName, fieldValue) =>
              setFieldValue('address', {
                ...values?.address,
                [fieldName]: fieldValue,
              })
            }
          />
          <Basic
            onChange={event =>
              setFieldValue('address', {
                ...values?.address,
                postal_code: event.target.value,
              })
            }
            value={values?.address?.postal_code}
            {...inputConfigs.postal_code}
            label={t(inputConfigs.postal_code.label)}
            required
            InputLabelProps={InputLabelProps}
          />
        </View>
      )}

      <RemoveAddressModal
        showModal={showModal}
        closeModal={closeModal}
        item={currentAddress}
        {...props}
      />
      <EditAddressModal
        showEditModal={showEditModal}
        openEditModal={openEditModal}
        closeEditModal={closeEditModal}
        item={currentAddressEdit}
        {...props}
      />
    </>
  );
}

function RemoveAddressModal(props) {
  const { showModal, closeModal, item } = props;
  const onCancel = () => {
    console.log('Cancelled');
    closeModal();
  };

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading('delete');
    const resp = await deleteItem('addresses', item?.address?.id);
    if (resp?.status === 'error') {
      showToast({
        text: 'Unable to delete addresses: ' + resp?.message,
        variant: 'error',
      });
    } else {
      showToast({
        id: 'addresses _delete',
        variant: 'success',
      });
    }
    setLoading(false);
    closeModal();
  }

  const buttons = [
    {
      id: 'cancel',
      onPress: onCancel,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'confirm',
      capitalize: true,
      color: 'primary',
      onPress: handleDelete,
      disabled: loading,
      loading,
    },
  ];

  const value = getValue(item?.address, 'addresses');

  return (
    <Modal
      maxWidth={415}
      open={showModal}
      disableBackdropClick
      style={{ padding: 0, margin: 0 }}>
      <>
        <View pt={1} w="100%">
          <Text
            pv={0.5}
            tA={'center'}
            s={18}
            c="fontLight"
            id="are_you_sure_to_delete_address"
          />
          {value ? (
            <Text
              color={'primary'}
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 16,
              }}>
              {value}
            </Text>
          ) : (
            <Text
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 16,
              }}
              id="unable_to_find_type"
              context={'address'}
            />
          )}
        </View>
        <View fD="row" w="100%" ph={1.5} pt={0.7}>
          <Button {...buttons?.[0]} wide />
          <Button {...buttons?.[1]} wide />
        </View>
      </>
    </Modal>
  );
}

function EditAddressModal(props) {
  const { showEditModal, closeEditModal, item, InputLabelProps } = props;
  const { t } = useTranslation(['common']);

  const onCancel = () => {
    console.log('Cancelled -Edit');
    closeEditModal();
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors = {};
    const requiredFields = [
      'line_1',
      'city',
      'state_province',
      'country',
      'postal_code',
    ];
    requiredFields.forEach(field => {
      if (!values[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast({
        text: 'Please fill in all required fields',
        variant: 'error',
      });
      return;
    }

    setLoading(true);
    const resp = await updateItem('addresses', values, item?.address?.id);
    if (resp?.status === 'error') {
      showToast({
        text: 'Unable to update address: ' + resp?.message,
        variant: 'error',
      });
    } else {
      showToast({
        text: 'Address updated successfully',
        variant: 'success',
      });
    }
    setLoading(false);
    closeEditModal();
  };
  const buttons = [
    {
      id: 'cancel',
      onPress: onCancel,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'update',
      capitalize: true,
      color: 'primary',
      onPress: handleSubmit,
      disabled: loading,
      loading,
    },
  ];
  const [values, setValues] = useState({});

  useEffect(() => {
    if (item?.address) {
      setValues({
        id: item?.address.id,
        type: item.address.type || '',
        line_1: item.address.line_1 || '',
        line_2: item.address.line_2 || '',
        city: item.address.city || '',
        state_province: item.address.state_province || '',
        country: item.address.country || '',
        postal_code: item.address.postal_code || '',
      });
    }
  }, [item]);

  const handleChange = event => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCountryChange = (fieldName, fieldValue) => {
    setValues({ ...values, [fieldName]: fieldValue });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  return (
    <Modal maxWidth={415} open={showEditModal} disableBackdropClick>
      <>
        <View w="100%" mt={0.25} p={1}>
          <Text
            bold
            style={{
              marginBottom: '1rem',
            }}>
            {t('Edit address')}
          </Text>
          <Basic
            onChange={handleChange}
            value={values?.line_1}
            name="line_1"
            {...inputConfigs.line_1}
            label={t(inputConfigs.line_1.label)}
            required
            InputLabelProps={InputLabelProps}
            error={Boolean(errors.line_1)}
            helperText={errors.line_1}
          />
          <Basic
            onChange={handleChange}
            value={values?.line_2}
            name="line_2"
            {...inputConfigs.line_2}
            label={t(inputConfigs.line_2.label)}
          />
          <Basic
            onChange={handleChange}
            value={values?.city}
            name="city"
            {...inputConfigs.city}
            label={t(inputConfigs.city.label)}
            required
            InputLabelProps={InputLabelProps}
            error={Boolean(errors.city)}
            helperText={errors.city}
          />
          <Basic
            onChange={handleChange}
            value={values?.state_province}
            name="state_province"
            {...inputConfigs.state_province}
            label={t(inputConfigs.state_province.label)}
            required
            InputLabelProps={InputLabelProps}
            error={Boolean(errors.state_province)}
            helperText={errors.state_province}
          />
          <Country
            returnCode
            name="country"
            value={values?.country ?? ''}
            setFieldValue={handleCountryChange}
            required
            InputLabelProps={InputLabelProps}
            error={Boolean(errors.country)}
            helperText={errors.country}
          />
          <Basic
            onChange={handleChange}
            value={values?.postal_code}
            name="postal_code"
            {...inputConfigs.postal_code}
            label={t(inputConfigs.postal_code.label)}
            required
            InputLabelProps={InputLabelProps}
            error={Boolean(errors.postal_code)}
            helperText={errors.postal_code}
          />
        </View>
        <View fD="row" w="100%" ph={1.5}>
          <Button {...buttons?.[0]} wide />
          <Button {...buttons?.[1]} wide />
        </View>
      </>
    </Modal>
  );
}
