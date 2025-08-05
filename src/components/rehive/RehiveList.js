import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardList from 'components/card/CardList';
import { walletsSelector } from 'screens/wallets/redux/selectors';
import { fetchData } from 'redux/rehive/actions';

class RehiveList extends Component {
  render() {
    const { data, type, ...restProps } = this.props;

    return (
      <CardList
        {...restProps}
        data={data}
        type={type}
        onRefresh={() => this.props.fetchData(type)}
        keyExtractor={item => (item.account + item.currency.code).toString()}
        emptyListMessage={'No active accounts/wallets'}
      />
    );
  }
}

// export default Wallets;

const mapStateToProps = (state, ownProps) => {
  switch (ownProps.type) {
    case 'accounts':
      return { data: walletsSelector(state) };
    // case 'wallets':
    // return { data: walletsSelector(state) }
    default:
      return { data: { data: [], loading: false } };
  }
};

export default connect(
  mapStateToProps,
  {
    fetchData,
  },
  null,
)(RehiveList);
