import React, { useState } from 'react';

import ScreenHeader from 'components/layout/ScreenHeader';

// import FilterListIcon from '@material-ui/icons/FilterList';
import RewardFilterChipList from './RewardFilterChipList';
import FilterList from 'components/lists/FilterList';

const ScreenConfig = {
  title: 'rewards',
  tabs: [
    { label: 'rewards', value: '' },
    { label: 'pending', value: 'pending' },
    { label: 'earned', value: 'history' },
  ],
};

const RewardScreenHeader = props => {
  const {
    state,
    handleStateChange,
    filters,
    setFilters,
    itemName,
    history,
    ...restProps
  } = props;

  const [filtersOpen, setFiltersOpen] = useState(false);

  const actions = [
    {
      id: 'filters',
      tooltip: 'filters',
      active: filters.expired,
      // icon: <FilterListIcon />,
      content: (
        <FilterList
          filters={[
            {
              label: 'unavailable_rewards',
              onClick: () =>
                setFilters({ ...filters, expired: !filters.expired }),
              value: filters.expired,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <ScreenHeader
      {...restProps}
      showSearchBox={true}
      state={state}
      id="rewards"
      onChange={handleStateChange}
      title={ScreenConfig.title}
      setOpen={setFiltersOpen}
      open={filtersOpen}
      tabs={ScreenConfig.tabs}
      hideTabs={restProps.modalVisible}
      actions={actions}
      FilterList={
        <RewardFilterChipList filters={filters} setFilters={setFilters} />
      }
      breadCrumbs={
        restProps.modalVisible
          ? [
              {
                name: 'rewards',
                onPress: () => history.push(`/rewards/`),
              },
              {
                name: itemName,
                onPress: () => {},
              },
            ]
          : []
      }
    />
  );
};

RewardScreenHeader.propTypes = {};

RewardScreenHeader.defaultProps = {};

export default RewardScreenHeader;
