import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { createProductOption, updateProductOption } from '../../util/rehive';

import Input from 'components/inputs';
import ButtonList from 'components/lists/ButtonList';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
// import Group from 'components/form/Group';
import { useFieldArray, useForm, FormProvider } from 'react-hook-form';
import Text from 'components/outputs/Text';

export default function ProductOptionsForm(props) {
  const {
    productId,
    setEditing,
    refreshItem,
    edit,
    context,
    defaultValues,
    fetchProductData,
  } = props;
  const classes = useStyles(props);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      values: defaultValues?.values?.map(value => ({ value })) ?? [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { control, watch, handleSubmit: handleFormSubmit } = methods;
  const formValues = watch();

  const onSubmit = async (data) => {
    const { values, option_name, id } = data;
    console.log('formValues', data);
    setLoading(true);
    const sellerId = context?.sellers?.[0]?.id ?? '';
    try {
      const submitData = {
        name: option_name,
        values: values?.map(item => item?.value),
      };
      let resp = null;

      if (id) {
        resp = await updateProductOption(sellerId, productId, id, submitData);
      } else {
        resp = await createProductOption(sellerId, productId, submitData);
      }

      refreshItem(true);
      fetchProductData();
      setEditing(null);
    } catch (e) {
      console.log('handleAddVariant -> e', e);
    }
    setLoading(false);
  };

  const arrayHelpers = useFieldArray({ control, name: 'values' });

  const { fields, append } = arrayHelpers;
  useEffect(() => {
    if (fields?.length === 0) {
      append({ name: '', new: true });
    }
  }, [fields]);

  return (
    <div className={classes.container}>
      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit(onSubmit)}>
          <Input
            config={{
              name: 'option_name',
              label: 'option_name',
            }}
            name="option_name"
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
              paddingTop: 8,
              color: '#222',
            }}
            id="values"
          />
          {/* <Group label="Values"> */}
          <>
            {fields && fields.length > 0 ? (
              <ul className={classes.container}>
                {fields.map((item, index) => (
                  <li className={classes.arrayRow} key={item?.id}>
                    <div className={classes.arrayRow}>
                      <Input
                        config={{
                          name: 'values[' + index + '].value',
                          label: 'Value ' + (index + 1),
                        }}
                        defaultValue={defaultValues?.values?.[index] ?? ''}
                        disabled={!(item?.new ?? true)}
                        name={`values[${index}].value`}
                      />
                    </div>
                    <div className={classes.remove}>
                      <IconButton
                        noPadding
                        size={16}
                        icon="minus"
                        color="error"
                        circled={false}
                        onClick={() => arrayHelpers.remove(index)}
                        // inverted
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyListMessage id="no_option_values" />
            )}
          </>
          <div className={classes.row}>
            <IconButton
              noPadding
              onClick={() => append({ name: '', new: true })}
              icon="plus"
              noMi
            />
          </div>
          {/* </Group> */}
          <ButtonList
            layout="vertical"
            noPadding
            items={[
              {
                id: edit ? 'save' : 'add',
                capitalize: true,
                onPress: () => handleFormSubmit(onSubmit)(),
                loading,
              },
              {
                label: 'cancel',
                variant: 'text',
                onPress: () => setEditing(null),
              },
            ]}
          />
        </form>
      </FormProvider>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    margin: 0,
    padding: 0,
    // paddingTop: theme.spacing(1),
  },
  arrayRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    width: '100%',
    display: 'flex',
    paddingBottom: theme.spacing(1.5),
    justifyContent: 'flex-end',
  },
  remove: {
    paddingLeft: theme.spacing(1),
    paddingTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
