import React, { useState,  } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import PageButtons from 'components/layout/page/PageButtons';
import DropdownSelector from 'components/inputs/DropdownSelector';
import CurrencyCard from './CurrencyCard';
import CurrencyCardSkeleton from 'screens/accounts/components/currency/CurrencyCardSkeleton';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';


export default function CurrencySelect(props) {
  const {
    state,
    isAuthed,
    currencies,
    handleCurrencyChange,
    currency
  } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState('');

  const enabled = isAuthed;

  const buttons = {}

  return (
    <>
      <PageContent pb={0}>
        {!currencies ? (
          <div className={classes.skeleton}>
            <CurrencyCardSkeleton />
          </div>
        ): (
        <DropdownSelector
            noPadding
            mb={0}
            data={currencies}
            item={currency}
            onValueChange={item =>
                handleCurrencyChange(item)
            }
            keyExtractor={item => item.code}
            renderItem={item => (
                <CurrencyCard
                    noPadding
                    noCard
                    mb={0}
                    disabled
                    align="left"
                    currency={item}
                />
            )}
        />)}
      </PageContent>
      <View ph={0.5} w="100%">
        <PageButtons layout="vertical" items={buttons} />
      </View>
    </>
  );
}

// <CardList
        //     smartLoading
        //     data={{
        //         ...currencies,
        //         items: currencies,
        //     }}
        //     skeleton={<CurrencyCardSkeleton />}
        //     renderItem={(item, index) => (
        //     <CurrencyCard
        //         key={index}
        //         onPress={() => handleCurrencyChange(item)}
        //         currency={item}
        //         containerCurrency={item}
        //         selected={
        //             item.code === currency?.code
        //         }
        //         state={state}
        //         showAccount={false}
        //     />
        //     )}
        // />)}

const useStyles = makeStyles(theme => ({
  text: { paddingBottom: theme.spacing(1) },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    // paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
    width: '100%',
  },
  walletSelector: {
    paddingTop: theme.spacing(1),
  },
  rate: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
}));
