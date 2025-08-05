import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Popover } from '@material-ui/core';
import {
  objectToArray,
  paramsToObj,
  paramsToSearch,
  removeEmptyFields,
} from 'util/general';
import FilterBarOption from './FilterBarOption';
import FilterLayout from './FilterLayout';
import { useHistory } from 'react-router-dom';
import { userProfileSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import { View } from 'components/layout/View';

export default function FilterBar(props) {
  const {
    filterConfig,
    filterOverride = {},
    fetchData,
    row,
    ...restProps
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const search = history?.location?.search;

  const filterArray = objectToArray(filterConfig, 'id');

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState('');
  let filters = paramsToObj(search);

  const profile = useSelector(userProfileSelector);
  if (typeof filterOverride === 'object')
    filters = { ...filters, ...filterOverride };

  function handleClick(event, variant) {
    const { override, id } = variant;
    if (typeof override === 'string') {
      history.push({ search: override });
      // fetchData();
    } else {
      setAnchorEl(event.currentTarget);
      setOpen(id);
    }
  }

  function handleClose() {
    setOpen('');
    setAnchorEl(null);
  }

  function clearFilter(item) {
    let newFilters = { ...filters };
    delete newFilters[item?.id ?? item];

    updateSearch(newFilters);
  }
  function onDelete(item) {
    if (item?.override) clearFilter(item?.override?.split('=')?.[0]);
    else if (item?.onDelete) item.onDelete();
    else {
      const { id } = item;
      let newFilters = { ...filters };

      delete newFilters[id];

      if (['date', 'created_date'].includes(id)) {
        delete newFilters.created__lt;
        delete newFilters.created__gt;
      } else if ('updated_date' === id) {
        delete newFilters.updated__lt;
        delete newFilters.updated__gt;
      } else if ('placed_date' === id) {
        delete newFilters.placed__lt;
        delete newFilters.placed__gt;
      } else if (id.match(/amount|number|quantity/)) {
        delete newFilters.amount__abs__gte;
        delete newFilters.amount__abs__lte;
        delete newFilters.amount__abs;
      }

      updateSearch(newFilters);
    }
  }

  function updateSearch(newFilters) {
    const search = paramsToSearch(newFilters);
    history.push({ search });
    fetchData && fetchData();
    handleClose();
  }

  function applyFilter(id, value) {
    if (id === 'merge')
      updateSearch(removeEmptyFields({ ...filters, ...value }));
    else updateSearch({ ...filters, [id]: value });
  }

  const filterProps = {
    ...(filterConfig?.[open] ?? {}),
    history,
    initialValue: filters?.[open],
    clearFilter,
    applyFilter,
    profile,
  };

  const FilterContent = (
    <View fD={'row'} gap={0.5}>
      {filterArray.map(item => (
        <FilterBarOption
          {...item}
          key={item.id}
          {...restProps}
          filters={filters}
          search={search}
          profile={profile}
          filterConfig={filterConfig}
          onClick={e => handleClick(e, item)}
          onDelete={() => onDelete(item)}
        />
      ))}
    </View>
  );

  return (
    <React.Fragment>
      <div className={classes.container}>
        {/* <IconButton
        aria-label="filter list"
        className={classes.iconButton}
        onClick={e => handleClick(e, 'all')}>
        <FilterListIcon color={'primary'} className={classes.icon} />
      </IconButton> */}
        {/* {row ? ( */}
        {/* <div className={classes.row}>{FilterContent}</div> */}
        {/* ) : ( */}
        {FilterContent}
        {/* )} */}
      </div>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(open) && Boolean(anchorEl) && Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 500,
            marginTop: 8,
            maxWidth: 350,
            width: '100%',
          },
        }}>
        <FilterLayout {...filterProps} {...restProps} />
      </Popover>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(0),
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(0.5),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    // flex: 1,
    flexWrap: 'wrap',
    // overflowX: 'scroll',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    // overflowX: 'scroll',
  },
  iconButton: {
    border: ({ active }) =>
      `${active ? 3 : 1}px solid ${theme.palette.primary.main}`,
    borderRadius: 50,
    height: 28,
    width: 28,
    maxHeight: 28,
    maxWidth: 28,

    padding: 4,
    paddingTop: 2,
    paddingBottom: 0,
    // marginRight: theme.spacing(1),
  },
  icon: {
    fontSize: 18,
  },
}));
