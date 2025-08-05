// import lib for making component
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import context from 'components/common/context';

class _CardListHeader extends Component {
  render() {
    const { header } = this.props;

    const {
      component,
      onRefresh,
      showRefresh,
      label,
      action,
      onPress,
    } = header;

    return component ? (
      component
    ) : label || action ? (
      <View
        fD={'row'}
        jC={'space-between'}
        aI={'center'}
        h={48}
        ph={0.5}
        style={{ paddingTop: 16 }}>
        <View fD={'row'} jC={'flex-start'} aI={'center'}>
          <Text t={'o'} p={0.5} ph={1}>
            {label}
          </Text>
          {showRefresh ? (
            <Button
              buttonStyle={{ padding: 0, minWidth: 0 }}
              type={'text'}
              icon={'refresh'}
              color={'font'}
              size={'tiny'}
              onPress={onRefresh}
              animation={'fadeIn'}
            />
          ) : null}
        </View>

        {header.action ? (
          <Button
            buttonStyle={{ padding: 0 }}
            label={action}
            onPress={onPress}
            size={'tiny'}
            type={'text'}
            color={'font'}
            animation={'fadeIn'}
          />
        ) : null}
      </View>
    ) : null;
  }
}

_CardListHeader.defaultProps = {
  header: { label: '', onPress: () => {}, component: null },
};

_CardListHeader.propTypes = {
  header: PropTypes.object,
};

const CardListHeader = context(_CardListHeader);

export { CardListHeader };
