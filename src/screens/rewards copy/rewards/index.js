import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { claimReward } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import GridContainer from 'components/layout/GridContainer';

import { rewardsSelector, campaignsSelector } from '../redux/selectors';
import {
  fetchRewards,
  fetchCampaigns,
  fetchRewardsNext,
  fetchCampaignsNext,
} from '../redux/actions';

import RewardList from './components/RewardList';
import RewardScreenHeader from './components/RewardScreenHeader';
import CampaignList from './components/CampaignList';

class RewardsContainer extends Component {
  state = {
    index: 0,
    state: '',
    detailVisible: false,
    modalVisible: false,
    indexLoading: false,
    filters: { expired: false },
    claimed: false,
  };

  constructor(props) {
    super(props);
    this.handleStateChange = this.handleStateChange.bind(this);
    // this.actionOne = this.actionOne.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    let paths = location.pathname.split('/');
    if (paths.length > 3) {
      this.setState({ state: paths[2] });
    }

    this.refresh();
  }

  refresh = () => {
    this.props.fetchRewards();
    this.props.fetchCampaigns();
  };

  /* container control */
  handleStateChange = (state, index) => {
    if (!index && index !== 0) {
      index = this.state.index;
    }
    this.setState({ index, state });
    this.props.history.push('/rewards/' + (state ? state + '/' : ''));
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  showModal = index => {
    this.setState({
      modalVisible: true,
      index,
      error: '',
    });
  };

  /* rehive actions */
  handleClaimReward = async (index, campaign) => {
    this.setState({ index, indexLoading: true });
    let response;
    const { showToast } = useToast();

    try {
      response = await claimReward({
        campaign: campaign.id,
      });

      let text = '';
      if (response.status === 'success') {
        text =
          campaign.default_status === 'accepted'
            ? 'Reward successfully claimed'
            : 'Your reward has been requested and it will reflect in your wallet balance upon admin approval';

        this.refresh();
      } else {
        if (
          response.message.includes('transaction') &&
          response.message.includes('amount')
        ) {
          if (response.message.includes(' 0')) {
            text = `You're unable to request this reward, required tier not met.`;
          } else {
            text = `You've reached your request limit for rewards, required tier not met.`;
          }
        } else {
          text =
            'Unable to request reward' +
            (response.message
              ? ': ' +
                (response.message.includes('transactions') &&
                response.message.includes('error')
                  ? 'please verify your account'
                  : response.message)
              : '');
        }
      }
      showToast({
        text,
      });
    } catch (e) {
      showToast({
        text: 'Unable to request reward' + (e.message ? ': ' + e.message : ''),
        variant: 'error',
      });
      console.log(e);
    }
    this.setState({ indexLoading: false });
  };

  renderHeader() {
    const { state, filters } = this.state;

    const setFilters = filters => this.setState({ filters });

    const props = {
      filters,
      state,
      setFilters,
      handleStateChange: this.handleStateChange,
    };

    return <RewardScreenHeader {...props} />;
  }

  renderHistory = () => {
    const { rewards, fetchRewards, fetchRewardsNext } = this.props;

    const data = {
      ...rewards,
      items: rewards.items.filter(
        reward => reward.status === 'accepted' || reward.status === 'rejected',
      ),
    };

    return (
      <RewardList
        data={data}
        fetchData={fetchRewards}
        fetchNext={fetchRewardsNext}
        handleStateChange={this.handleStateChange}
      />
    );
  };

  renderAvailable = () => {
    const { campaigns, fetchCampaigns, fetchCampaignsNext } = this.props;
    const { filters, indexLoading } = this.state;

    const data = {
      ...campaigns,
      items: filters.expired ? campaigns.items2 : campaigns.items,
    };

    return (
      <CampaignList
        loading={indexLoading}
        data={data}
        fetchData={fetchCampaigns}
        fetchNext={fetchCampaignsNext}
        handleStateChange={this.handleStateChange}
        handleClaimReward={this.handleClaimReward}
        onRefresh={this.refresh}
      />
    );

    // return (
    //   <CardList
    //     grid
    //     emptyListMessage={'No available rewards'}
    //     type="reward"
    //     data={data}
    //     fetchData={fetchCampaigns}
    //     fetchNext={fetchCampaignsNext}
    //     handleStateChange={this.handleStateChange}
    //     renderItem={(item, ind) => (
    //       <CampaignCard
    //         key={item.id}
    //         handleStateChange={this.handleStateChange}
    //         handleClaimReward={this.handleClaimReward}
    //         showModal={this.showModal}
    //         item={item}
    //         index={ind}
    //         loading={ind === index && indexLoading}
    //         pendingRewards={campaigns.pendingRewards}
    //       />
    //     )}
    //   />
    // );
  };

  // renderModal() {
  //   const { campaigns, rewards } = this.props;
  //   const { filters, index, indexLoading, state } = this.state;
  //   const data = state
  //     ? {
  //         ...rewards,
  //         items: rewards.items.filter(reward =>
  //           state === 'history'
  //             ? reward.status === 'accepted' || reward.status === 'rejected'
  //             : reward.status === 'pending',
  //         ),
  //       }
  //     : {
  //         ...campaigns,
  //         items: filters.expired ? campaigns.items2 : campaigns.items,
  //       };

  //   const item = data.items[index];

  //   if (!state) {
  //     return (
  //       <CampaignCard
  //         noCard
  //         hideModal={this.hideModal}
  //         handleStateChange={this.handleStateChange}
  //         handleClaimReward={this.handleClaimReward}
  //         showModal={this.showModal}
  //         item={item}
  //         index={index}
  //         loading={indexLoading}
  //         pendingRewards={campaigns.pendingRewards}
  //       />
  //     );
  //   } else {
  //     return (
  //       <RewardCard
  //         noCard
  //         hideModal={this.hideModal}
  //         handleStateChange={this.handleStateChange}
  //         showModal={this.showModal}
  //         item={item}
  //         index={index}
  //         loading={indexLoading}
  //         pendingRewards={campaigns.pendingRewards}
  //       />
  //     );
  //   }
  // }

  renderPending = () => {
    const { rewards, fetchRewards, fetchRewardsNext } = this.props;
    const { index } = this.state;

    const data = {
      ...rewards,
      items: rewards.items.filter(campaign => campaign.status === 'pending'),
    };

    return (
      <RewardList
        data={data}
        fetchData={fetchRewards}
        fetchNext={fetchRewardsNext}
        handleStateChange={this.handleStateChange}
        pending
      />
    );
  };

  renderRouter() {
    const { history, rewards, campaigns } = this.props;
    const sharedRouteProps = {
      exact: true,
      history,
    };

    return (
      <Switch>
        <Route
          {...sharedRouteProps}
          component={this.renderAvailable}
          path="/rewards/"
        />
        <Route
          {...sharedRouteProps}
          component={this.renderPending}
          path="/rewards/pending/"
        />
        <Route
          {...sharedRouteProps}
          component={this.renderHistory}
          path="/rewards/history/"
        />
      </Switch>
    );
  }

  renderContent() {
    return (
      <GridContainer
        header={this.renderHeader()}
        content={this.renderRouter()}
      />
    );
  }

  render() {
    // const { modalVisible } = this.state;
    return (
      <React.Fragment>
        {this.renderContent()}
        {/* <Toast /> */}
        {/* <Modal open={modalVisible} onDismiss={this.hideModal}>
          {this.renderModal()}
        </Modal> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    rewards: rewardsSelector(state),
    campaigns: campaignsSelector(state),
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRewards,
    fetchCampaigns,
    fetchRewardsNext,
    fetchCampaignsNext,
  },
  null,
)(RewardsContainer);
