import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { claimReward } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import GridContainer from 'components/layout/GridContainer';
import { rewardsSelector, campaignsSelector } from './redux/selectors';
import {
  fetchRewards,
  fetchCampaigns,
  fetchRewardsNext,
  fetchCampaignsNext,
} from './redux/actions';
import RewardList from './components/RewardList';
import RewardScreenHeader from './components/RewardScreenHeader';
import CampaignList from './components/CampaignList';

function RewardsContainer(props) {
  const { showToast } = useToast();
  const [stateIndex, setStateIndex] = useState(false);
  const [componentState, setComponentState] = useState(false);
  // const [detailVisible, setDetailVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [indexLoading, setIndexLoading] = useState(false);
  const [filters, setFilters] = useState({ expired: false });
  // const [claimed, setClaimed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemName, setItemName] = useState('');

  const debounceTimer = useRef();

  const debounce = (callback, delay) => {
    return (...args) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const debouncedFetchCampaigns = debounce(query => {
    props.fetchCampaigns(query);
  }, 500);

  useEffect(() => {
    debouncedFetchCampaigns(searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    // const { location } = props;
    // let paths = location.pathname.split('/');
    // if (paths.length > 3) setComponentState(paths[2]);
    refresh();
  }, []);
  const handleSearchSubmit = event => {
    event.preventDefault();
    refresh(searchQuery);
  };
  const refresh = (query = '') => {
    props.fetchRewards();
    props.fetchCampaigns(query);
  };

  /* container control */
  const handleStateChange = (state, index) => {
    if (!index && index !== 0) {
      index = stateIndex;
    }
    setStateIndex(index);
    setComponentState(state);
    props.history.push('/rewards/' + (state ? state + '/' : ''));
  };

  /* rehive actions */
  const handleClaimReward = async (index, campaign) => {
    setStateIndex(index);
    setIndexLoading(true);
    let response;

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

        refresh();
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
    setIndexLoading(false);
  };

  const renderHeader = () => {
    return (
      <RewardScreenHeader
        {...{
          state: componentState,
          filters,
          setFilters,
          handleStateChange,
          modalVisible,
          itemName,
          history: props.history,
          setModalVisible,
          setSearchQuery,
          handleSearchSubmit,
        }}
      />
    );
  };

  const renderAvailable = () => {
    const { campaigns, fetchCampaignsNext } = props;

    const data = {
      ...campaigns,
      items: filters.expired ? campaigns.items2 : campaigns.items,
    };

    return (
      <CampaignList
        loading={indexLoading}
        data={data}
        // fetchData={fetchCampaigns}
        fetchData={props.fetchCampaigns}
        fetchNext={fetchCampaignsNext}
        handleStateChange={handleStateChange}
        handleClaimReward={handleClaimReward}
        onRefresh={refresh}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setItemName={setItemName}
        history={props.history}
      />
    );
  };

  const renderPending = () => {
    const { rewards, fetchRewards, fetchRewardsNext, history } = props;

    const data = {
      ...rewards,
      items: rewards.items.filter(campaign => campaign.status === 'pending'),
    };

    return (
      <RewardList
        data={data}
        fetchData={fetchRewards}
        fetchNext={fetchRewardsNext}
        handleStateChange={handleStateChange}
        pending
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setItemName={setItemName}
        history={history}
      />
    );
  };

  const renderHistory = () => {
    const { rewards, fetchRewards, fetchRewardsNext, history } = props;

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
        handleStateChange={handleStateChange}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setItemName={setItemName}
        history={history}
      />
    );
  };

  const renderRouter = () => {
    const { history } = props;
    const sharedRouteProps = {
      exact: true,
      history,
    };

    return (
      <Switch>
        <Route
          {...sharedRouteProps}
          component={renderAvailable}
          path="/rewards/"
        />
        <Route
          {...sharedRouteProps}
          component={renderPending}
          path="/rewards/pending/"
        />
        <Route
          {...sharedRouteProps}
          component={renderHistory}
          path="/rewards/history/"
        />
      </Switch>
    );
  };

  const renderContent = () => {
    return <GridContainer header={renderHeader()} content={renderRouter()} />;
  };

  return (
    <React.Fragment>
      {renderContent()}
      {/* <Toast /> */}
      {/* <Modal open={modalVisible} onDismiss={this.hideModal}>
          {this.renderModal()}
        </Modal> */}
    </React.Fragment>
  );
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
