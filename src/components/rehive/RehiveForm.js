import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import Inputs from './config/inputs';
import { updateItem } from 'util/rehive';
import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import context from 'components/app/context';
import Empty from 'config/empty';
import ButtonList from 'components/lists/ButtonList';
import {
  validateMobile,
  validateCrypto,
  validateCrypto2,
} from 'util/validation';
import { getName, getCode } from 'country-list';

class _RehiveForm extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const { type, profileConfig } = this.props;
    const empty = getEmpty(type);
    let fields = Object.keys(empty).map(key => Inputs[type][key]);

    if (type === 'profile' && profileConfig.hideID) {
      const index = fields.findIndex(field => field.name === 'id_number');
      fields.splice(index, 1);
    }

    this.setState({ fields });
  }

  handleSubmit = async props => {
    const { type, onSave, onSaveSuccess, crypto, testnet, item } = this.props;
    let { values, setSubmitting, setStatus } = props; // FormikProps
    try {
      if (type === 'profile') {
        if (values.birth_date) {
          values.birth_date = values.birth_date.format('YYYY-MM-DD');
        }

        if (values.nationality) {
          values.nationality = getCode(values.nationality);
        }
      }
    } catch (e) {
      console.log('TCL: e', e);
    }

    let data = values;
    if (type === 'cryptoAccounts') {
      data = {
        id: item.id,
        address: values.cryptoAddress,
        metadata: { testnet, name: values.name },
      };
      data.crypto_type = crypto;
    }
    setSubmitting(true);
    try {
      if (onSave) onSave(type, data);
      else {
        const resp = await updateItem(type, data);
        onSaveSuccess && onSaveSuccess(type, resp);
      }
    } catch (error) {
      console.log('TCL: error', error);
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
    // console.log('TCL: renderInput -> props', props);
    // console.log('TCL: renderInput -> item', item);
    return <Input field={item} key={item.name} formikProps={props} />;
  }

  validation(values, type, testnet, crypto) {
    let result = {};
    let error = '';
    switch (type) {
      case 'emails':
        const schema = {
          email: yup
            .string()
            .email('Please enter a valid email')
            .required('Email is required'),
        };
        const formSchema = yup.object().shape(schema);
        try {
          result = formSchema.validateSync(values);
        } catch (e) {
          result = e;
        }
        if (result.path) {
          return {
            [result.path]: result.message,
          };
        }
        return {};
      case 'mobiles':
        error = validateMobile(values.number);
        if (error && typeof error !== 'boolean') {
          return { number: error };
        }

        break;
      case 'cryptoAccounts':
        error = validateCrypto2(values.cryptoAddress, crypto, testnet);
        if (error) {
          return { cryptoAddress: error };
        }

        break;
      default:
        return {};
    }

    return result;
  }

  render() {
    const {
      item,
      type,
      noPadding,
      onDetailClose,
      testnet,
      crypto,
    } = this.props;
    const { fields } = this.state;
    let initialValues = item ? item : getEmpty(type);
    try {
      initialValues = {
        ...initialValues,
        country: getName(initialValues.country ? initialValues.country : ''),
        nationality: getName(
          initialValues.nationality ? initialValues.nationality : '',
        ),
        cryptoAddress: initialValues.address,
      };
    } catch (e) {
      console.log('TCL: ProfileHeader -> render -> e', e);
    }

    let schema = {};

    const formSchema = yup.object().shape(schema); // automate this?

    return (
      <Formik
        ref={input => {
          this[type + 'Form'] = input;
        }}
        initialValues={initialValues}
        // validationSchema={formSchema}
        validate={values => {
          const valid = this.validation(values, type, testnet, crypto);
          return valid;
        }}
        onSubmit={(values, formikBag) =>
          this.handleSubmit({ values, ...formikBag })
        }>
        {props => (
          <Form style={{ width: '100%' }}>
            <View ph={noPadding ? 0 : 1} w={'100%'}>
              {fields.map((field, index) => {
                return this.renderInput(props, field, index);
              })}
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

const RehiveForm = context(_RehiveForm);

export { RehiveForm };
// export default RehiveForm;

const getEmpty = type => {
  switch (type) {
    case 'addresses':
      return Empty.EMPTY_ADDRESS;
    case 'bankAccounts':
      return Empty.EMPTY_BANK_ACCOUNT;
    case 'cryptoAccounts':
      return Empty.EMPTY_CRYPTO;
    case 'emails':
      return Empty.EMPTY_EMAIL;
    case 'mobiles':
      return Empty.EMPTY_MOBILE;
    case 'profile':
      return Empty.EMPTY_PROFILE;
    default:
      return {};
  }
};
