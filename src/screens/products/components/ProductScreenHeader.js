import React, { useState, useEffect } from 'react';
import { orderBy } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import ScreenHeader from 'components/layout/ScreenHeader';
import FilterListIcon from '@material-ui/icons/FilterList';
import CartHeader from './CartHeader';
import { getSellers } from 'util/rehive';
import { paramsToObj } from 'util/general';
import { useCart } from '../util/contexts/CartContext';
import { useQuery } from 'react-query';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';
import { useRehiveContext } from 'contexts';

const ScreenConfig = {
  title: 'products',
  tabs: [
    { label: 'products', id: '' },
    { label: 'vouchers', id: 'vouchers' },
    { label: 'orders', id: 'orders' },
  ],
};

export default function ProductScreenHeader(props) {
  const {
    state,
    handleStateChange,
    clearAndApply,
    renderCart,
    primaryCurrencies,
    currency,
    filterConfig,
    history,
    cartAmount,
    profile,
    context: { categories, categoriesDrawerOpen, setCategoriesDrawerOpen } = {},
    ...restProps
  } = props;
  const { user } = useRehiveContext();

  const [filtersOpen, setFiltersOpen] = useState(null);

  const { cart } = useCart();
  const company = useSelector(currentCompanySelector);

  const classes = useStyles(props);

  const { location = {} } = history;
  const { search } = location;

  const filterOverride = cart?.seller?.id ? { seller: cart?.seller?.id } : {};
  const filterActive = Boolean(search);

  const activeFilters =
    decodeURIComponent(paramsToObj(search)?.categories ?? '')
      .split(',')
      .filter(item => item) ?? [];

  const activeCategory = categories?.find(x => x.id === activeFilters?.[0]);

  const activeParent =
    activeCategory?.parent &&
    categories?.find(x => x.id === activeCategory?.parent?.id);

  let breadCrumbRoutes = [];

  if (activeParent) {
    breadCrumbRoutes = [activeParent, activeCategory]?.map(x => {
      return {
        name: x?.name,
        onPress: () =>
          history.push(
            `/products/?currency=${cart?.currency?.code}&categories=${x.id}`,
          ),
      };
    });
  }

  // const breadCrumbRoutes = orderBy(
  //   categories?.filter(x => activeFilters?.includes(x.id)) ?? [],
  //   [x => x.parent],
  //   ['desc'],
  // )?.map(x => {
  //   return {
  //     name: x?.name,
  //     onPress: () =>
  //       history.push(
  //         `/products/?currency=${cart?.currency?.code}&categories=${x.id}`,
  //       ),
  //   };
  // });

  const { data: dataSellers, isLoading } = useQuery(
    [company?.id, 'sellers'],
    () => getSellers('?page_size=250', true),
    {
      enabled: Boolean(company?.id),
      staleTime: 60000,
    },
  );
  const sellers = dataSellers?.results ?? [];

  let actions = [];

  if (filterConfig) {
    actions.push({
      id: 'filters',
      tooltip: 'filters',
      active: filterActive || filtersOpen,
      variant: 'bar',
      icon: <FilterListIcon />,
    });
  }

  return (
    <ScreenHeader
      {...restProps}
      context={{
        loading: isLoading,
        sellers,
        profile,
        primaryCurrencies,
      }}
      id="products"
      descriptionMessage="product_page_description"
      history={history}
      state={state === 'checkout' ? '' : state}
      onChange={handleStateChange}
      title={ScreenConfig.title}
      isBusiness={Boolean(user?.groups[0]?.name === 'business')}
      setOpen={setFiltersOpen}
      open={filtersOpen}
      showFilterListIcon={true}
      extra={
        <div className={classes.extra}>
          {(!state || !['vouchers', 'orders'].includes(state)) && (
            <CartHeader
              history={history}
              propPrimaryCurrencies={primaryCurrencies}
            />
          )}
        </div>
      }
      filterOverride={filterOverride}
      filterConfig={filterConfig}
      tabs={ScreenConfig.tabs}
      actions={[]}
      actions2={actions}
      breadCrumbs={breadCrumbRoutes}
      toggleMenu={
        !state ? () => setCategoriesDrawerOpen(!categoriesDrawerOpen) : null
      }
      // FilterList={
      //   <ProductFilterChipList
      //     profile={profile}
      //     // filters={filterProps.activeFilters}
      //     clearAndApply={clearAndApply}
      //   />
      // }
    />
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  extra: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: theme.spacing(0.5),
    [theme.breakpoints.down(720)]: {
      paddingBottom: 0,
    },
  },
}));
