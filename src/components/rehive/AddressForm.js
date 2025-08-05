import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import Inputs from './config/inputs';
import { updateItem, createAddress } from 'util/rehive';
import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import context from 'components/app/context';
import { EMPTY_ADDRESS } from 'config/empty';
import ButtonList from 'components/lists/ButtonList';
import { getName, getCode } from 'country-list';
import AddressTypeInput from './AddressTypeInput';

class _AddressForm extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const empty = EMPTY_ADDRESS;
    let fields = Object.keys(empty).map(key => Inputs.addresses[key]);

    this.setState({ fields });
  }

  handleSubmit = async props => {
    const { onSaveSuccess } = this.props;
    const type = 'addresses';
    const { values, setSubmitting, setStatus } = props; // FormikProps

    const { types, country } = values;

    let data = {
      ...values,
      country: getCode(country ? country : ''),
    };
    delete data.types;
    setSubmitting(true);
    try {
      if (types && types.length && types.length > 0) {
        for (let i = 0; i < types.length; i++) {
          await createAddress({ ...data, type: types[i] });
        }
      } else await updateItem(type, data);

      onSaveSuccess && onSaveSuccess(type);
    } catch (error) {
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  };

  onSubmitEditing(index, props) {
    const { fields } = this.state;

    try {
      if (fields.length > index + 1) {
        this[fields[index + 1].id].focus();
      } else {
        // if (props.isValid) {
        this.handleSubmit(props);
        // } else {
        //   props.validateForm();
        // }
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  renderInput(props, item, index) {
    return <Input field={item} key={item.name} formikProps={props} />;
  }

  render() {
    const { item, type, noPadding, onDetailClose, profileConfig } = this.props;
    const addressTypes = profileConfig?.addressTypes?.length
      ? profileConfig.addressTypes
      : ['permanent'];

    const { fields } = this.state;
    let initialValues = item ? item : EMPTY_ADDRESS;
    try {
      initialValues = {
        ...initialValues,
        country: getName(initialValues.country ? initialValues.country : ''),
        types: [type ?? addressTypes?.[0] ?? 'permanent'],
      };
    } catch (e) {}

    let schema = {};

    const formSchema = yup.object().shape(schema); // automate this?

    return (
      <Formik
        ref={input => {
          this['AddressForm'] = input;
        }}
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={(values, formikBag) =>
          this.handleSubmit({ values, ...formikBag })
        }>
        {props => (
          <Form style={{ width: '100%' }}>
            <View ph={noPadding ? 0 : 1} w={'100%'}>
              {fields.map((field, index) => {
                return this.renderInput(props, field, index);
              })}
              {addressTypes?.length > 1 && (
                <AddressTypeInput
                  addressTypes={addressTypes}
                  editing={Boolean(item)}
                  value={props.values.type}
                  values={props.values.types}
                  setFieldValue={props.setFieldValue}
                />
              )}
              {props.status && props.status.error ? (
                <Text p={1} color={'error'} tA={'center'}>
                  {props.status.error}
                </Text>
              ) : null}
            </View>
            <ButtonList
              items={[
                {
                  id: 'cancel',
                  capitalize: true,
                  onPress: onDetailClose,
                },
                {
                  id: 'save',
                  capitalize: true,
                  type: 'submit',
                  // onPress: () => this.handleSubmit(props),
                  disabled: !props.isValid || props.isSubmitting,
                  loading: props.isSubmitting,
                },
              ]}
              variant={'text'}
            />
          </Form>
        )}
      </Formik>
    );
  }
}

const AddressForm = context(_AddressForm);

export { AddressForm };
