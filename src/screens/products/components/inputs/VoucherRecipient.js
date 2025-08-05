import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { userMobilesSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import Text from 'components/outputs/Text';
import RadioSelector from 'components/inputs/RadioSelector';
import { Button } from 'components/inputs/Button';
import Input from 'components/inputs/Input';
import { mobile_number } from 'config/inputs';
import EmptyListMessage from 'components/lists/EmptyListMessage';

export default function VoucherRecipient(props) {
  const { formikProps, onSubmitEditing } = props;

  const { setFieldValue, values, setFieldTouched, setStatus } = formikProps;
  const { recipientType } = values;
  const mobiles = useSelector(userMobilesSelector);
  const setRecipientType = value => setFieldValue('recipientType', value);

  const classes = useStyles();

  const recipientTypes = ['For me', 'For someone else'].map(item => {
    return { id: item, label: item, value: item };
  });

  return (
    <div className={classes.contianer}>
      <Text id="recipient" />
      <RadioSelector
        keyExtractor={item => item}
        items={recipientTypes}
        handleChange={item => {
          setRecipientType(item);
        }}
        noPadding
        value={recipientType}
        placement="top"
      />

      {recipientType === 'For me' ? (
        mobiles.data && mobiles.data.length ? (
          <>
            {mobiles.data.map(item => (
              <Button
                onPress={() => {
                  setFieldValue('number', item.number);
                  setStatus({ scene: 'voucher' });
                }}
                key={item.id}>
                <div
                  style={{
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    margin: 8,
                    borderRadius: 5,
                    flexDirection: 'row',
                    paddingRight: 12,
                  }}>
                  <Text>{item.number}</Text>
                </div>
              </Button>
            ))}
          </>
        ) : (
          <EmptyListMessage>
            No mobile numbers saved, please add one under profile
          </EmptyListMessage>
        )
      ) : (
        <React.Fragment>
          <Input
            formikProps={formikProps}
            field={mobile_number}
            autoCorrect={false}
          />
          <Button
            {...{
              label: 'NEXT',
              wide: true,
              loading: formikProps.isSubmitting,
              disabled: formikProps.isSubmitting || !formikProps.isValid,
              onPress: () => setStatus({ scene: 'voucher' }),
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {},
}));
