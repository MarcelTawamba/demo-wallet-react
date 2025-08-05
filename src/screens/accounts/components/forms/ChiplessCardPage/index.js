import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import AddChiplessCardForm from './AddChiplessCardForm';
import ChiplessCardLimits from './ChiplessCardLimits';
import ErrorOutput from 'components/outputs/Error';
import { Button } from 'components/inputs/Button';
import ChiplessCard from './ChiplessCard';
import { View } from 'components/layout/View';
import Spinner from 'components/outputs/Spinner';
import { getChiplessCards } from 'util/rehive';
import ButtonList from 'components/lists/ButtonList';
import EmptyListMessage from 'components/lists/EmptyListMessage';

const pageConfig = {
  '': {
    title: 'Card',
  },
  add: {
    title: 'Add card',
  },
  pin: {
    title: 'Card pin',
  },
  limits: {
    title: 'Card limits',
  },
};

export default function ChiplessCardPage(props) {
  const { currency, actionsConfig } = props;
  const config = actionsConfig?.card?.config ?? {};
  const { disableAdd } = config;

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('');
  const [error, setError] = useState('');

  async function fetchData() {
    const resp = await getChiplessCards();
    if (resp.status === 'success') {
      setCards(
        get(resp, ['data', 'results'], []).filter(
          item => item.account === currency.account,
        ),
      );
    } else {
      setError('Unable to retrieve cards');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sharedProps = { currency, fetchData, setState, cards, config };

  let buttons = [
    {
      label: 'Pin',
      customIcon: 'pin',
      wide: true,
      onPress: () => setState('pin'),
    },
    {
      label: 'Limits',
      customIcon: 'limits',
      wide: true,
      onPress: () => setState('limits'),
    },
  ];

  return (
    <>
      <PageTitle
        title={get(pageConfig, [state, 'title'])}
        handleBack={() => {
          setState('');
        }}
        back={Boolean(state)}
      />
      <PageContent>
        {state === 'add' || state === 'pin' ? (
          <AddChiplessCardForm {...sharedProps} item={get(cards, 0, null)} />
        ) : state === 'limits' ? (
          <ChiplessCardLimits {...sharedProps} />
        ) : loading ? (
          <Spinner />
        ) : cards && cards.length ? (
          <View aI="center" pb={1}>
            <ChiplessCard item={cards[0]} {...sharedProps} />
            <ButtonList items={buttons} layout="vertical" />
          </View>
        ) : !disableAdd ? (
          <Button
            label="ADD CARD"
            onPress={() => setState('add')}
            wide
            color="primary"
          />
        ) : (
          <EmptyListMessage>No available card</EmptyListMessage>
        )}
        <ErrorOutput>{error}</ErrorOutput>
      </PageContent>
    </>
  );
}
