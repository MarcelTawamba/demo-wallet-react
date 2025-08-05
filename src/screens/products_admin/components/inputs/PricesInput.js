import React, { useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Selector from 'components/inputs/SelectorRHF';
import Input from 'components/inputs';
import Icon from 'components/outputs/Icon';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { useFieldArray } from 'react-hook-form';
import Text from 'components/outputs/Text';
import InputAdornment from '@material-ui/core/InputAdornment';

export default function PricesInput(props) {
  const { control, register, currencyOptions, defaultValues } = props;
  const classes = useStyles();

  const arrayHelpers = useFieldArray({
    control,
    name: 'prices',
    keyName: 'rhfId',
  });

  const { fields, append, remove } = arrayHelpers;
  // useEffect(() => {
  //   if (fields?.length === 0) {
  //     append('');
  //   }
  // }, [fields]);

  const disableAdd = currencyOptions?.length === fields?.length;

  return (
    <>
      <>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            paddingTop: 8,
            color: '#222',
          }}
          id="prices"
        />
        {fields && fields.length > 0 ? (
          <ul className={classes.arrayContainer}>
            {fields.map((item, index) => {
              const options = currencyOptions.filter(item => {
                for (let i = 0; i < index; i++) {
                  if (fields[i]?.currency === item?.value) {
                    return false;
                  }
                }
                return true;
              });
              return (
                <li className={classes.arrayRow} key={item?.rhfId}>
                  <div className={classes.arrayRow}>
                    <Input
                      register={register}
                      control={control}
                      config={{
                        name: `prices[${index}].amount`,
                        label: 'Price ' + (index + 1),
                      }}
                      name={`prices[${index}].amount`}
                      endAdornment={
                        <InputAdornment position="end">
                          <Selector
                            control={control}
                            name={`prices[${index}].currency`}
                            variant="simple"
                            options={options}
                            defaultValue={
                              defaultValues?.[index]?.currency ??
                              options?.[0]?.value
                            }
                          />
                        </InputAdornment>
                      }
                      defaultValue={defaultValues?.[index]?.amount ?? ''}
                    />
                  </div>
                  <div className={classes.remove}>
                    <IconButton
                      noPadding
                      size={16}
                      icon="minus"
                      circled={false}
                      color="error"
                      onClick={() => remove(index)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyListMessage id="no_variant_prices" />
        )}
      </>
      <div className={classes.row}>
        <IconButton
          onClick={() => append('', true)}
          noPadding
          disabled={disableAdd ?? false}>
          <Icon
            icon="plus"
            noMi
            size={16}
            color={disableAdd ? '#e2e2e2' : 'primary'}
          />
        </IconButton>
      </div>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(1),
  },
  remove: {
    paddingLeft: theme.spacing(1),
    paddingTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrayRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingInlineStart: 0,
    alignItems: 'center',
  },
  arrayContainer: {
    padding: 0,
    margin: 0,
    paddingTop: theme.spacing(1),
  },
  currency: {
    // maxWidth: '40%',
    minWidth: 100,
    paddingRight: theme.spacing(2),
  },
}));
