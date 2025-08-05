import React, { useState } from 'react';

import ScreenHeader from 'components/layout/ScreenHeader';

import FilterListIcon from '@material-ui/icons/FilterList';
import RewardFilterChipList from './RewardFilterChipList';
import FilterList from 'components/lists/FilterList';

const ScreenConfig = {
  title: 'Rewards',
  tabs: [
    { label: 'Available', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Earned', value: 'history' },
  ],
};

const RewardScreenHeader = props => {
  const { state, handleStateChange, filters, setFilters } = props;

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
              label: 'Unavailable rewards',
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
      state={state}
      onChange={handleStateChange}
      title={ScreenConfig.title}
      setOpen={setFiltersOpen}
      open={filtersOpen}
      tabs={ScreenConfig.tabs}
      actions={actions}
      FilterList={
        <RewardFilterChipList filters={filters} setFilters={setFilters} />
      }
    />
  );
};

RewardScreenHeader.propTypes = {};

RewardScreenHeader.defaultProps = {};

export default RewardScreenHeader;
