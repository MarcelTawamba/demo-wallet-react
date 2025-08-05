import React, { Component } from 'react';
import { View } from 'components/layout/View';
import { get } from 'lodash';
import EmptyListMessage from '../lists/EmptyListMessage';
import Grid from 'components/layout/Grid';
import Spinner from 'components/outputs/Spinner';
import { Button } from 'components/inputs/Button';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';

class CardList extends Component {
  state = { mounted: false };

  componentDidMount() {
    // this.props.fetchData();
  }

  renderContent() {
    const { data, renderItem, skeleton } = this.props;
    const { items, loading, page } = data;

    return loading && page === 1 ? (
      new Array(3).fill(0).map(x => skeleton)
    ) : loading && page > 1 ? (
      <>
        {items?.map((item, index) => renderItem(item, index))}
        {new Array(3).fill(0).map(x => skeleton)}
      </>
    ) : (
      items?.map((item, index) => renderItem(item, index))
    );
  }

  renderFooter() {
    const { data, fetchNext, smartLoading } = this.props;
    const { loading, more } = data;

    if (
      (!loading && !more) ||
      (smartLoading && get(data, ['items', 'length']) > 0)
    )
      return null;

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        {loading ? null : more ? (
          <View mt={1}>
            <Button
              color={'primary'}
              variant={'text'}
              onPress={fetchNext}
              id="load_more"
              capitalize
            />
          </View>
        ) : (
          <div style={{ height: '100px' }} />
        )}
      </div>
    );
  }

  render() {
    const {
      grid,
      renderDetail,
      data: { items, loading },
      emptyListMessage = '',
      type,
      skeleton,
    } = this.props;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        }}>
        {renderDetail ? (
          renderDetail()
        ) : loading && !skeleton ? (
          <Spinner />
        ) : !loading && !items?.length ? (
          type ? (
            <EmptyListPlaceholderImage name={type} text={emptyListMessage} />
          ) : (
            <EmptyListMessage id={emptyListMessage} />
          )
        ) : grid ? (
          <Grid columns={this.props.columns} footer={this.renderFooter()}>
            {this.renderContent()}
          </Grid>
        ) : (
          <View gap={1}>
            {this.renderContent()}
            {this.props.customFooter}
            {this.renderFooter()}
          </View>
        )}
      </div>
    );
  }
}

export default CardList;
