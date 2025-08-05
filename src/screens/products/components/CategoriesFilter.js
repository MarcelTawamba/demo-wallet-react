import React, { useEffect, useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Hidden from '@material-ui/core/Hidden';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import CategoryFilter from 'components/filter/CategoriesFilter';
import { paramsToObj, paramsToSearch } from 'util/general';
import { useHistory } from 'react-router-dom';
import { categoriesFilterMap } from 'util/filters';
import Drawer from '@material-ui/core/Drawer';

export default function CategoriesFilter(props) {
  const {
    fetchData,
    row,
    categories,
    loading,
    drawerOpen,
    setDrawerOpen,
    ...restProps
  } = props;

  const history = useHistory();
  const search = history?.location?.search;

  const filtersSearch = paramsToObj(search);

  const initialValue =
    decodeURIComponent(filtersSearch?.categories ?? '')
      .split(',')
      .filter(item => item) ?? [];

  const [filters, setFilters] = useState({ categories: '' });
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(initialValue);
  const [init, setInit] = useState(false);

  function updateSearch(newFilters) {
    const search = paramsToSearch(newFilters, false);
    history.push({ search });
  }

  function applyFilter(value) {
    const id = 'categories';
    if (value?.length) {
      updateSearch({ ...filtersSearch, [id]: value });
    } else if (filtersSearch?.[id]) {
      let tempSearch = filtersSearch;
      delete tempSearch[id];
      updateSearch(tempSearch);
    }
  }

  useEffect(() => {
    let timer = null;
    if (init) {
      applyFilter(
        categoriesFilterMap({
          value,
        }),
      );
    } else setInit(true);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  const filterProps = {
    id: 'categories',
    context: { categories, loading },
    history,
    value,
    setValue,
    open,
    setOpen,
  };

  function handleClear() {
    setValue([]);
    setOpen([]);
    applyFilter([]);
    setDrawerOpen(false);
  }

  function renderContent() {
    return (
      <View p={1} w={'100%'}>
        <View fD="row" w="100%" jC="space-between" aI={'center'}>
          <Text color="primary" s={18} bold id="categories" />
          <View fD="row">
            {!!value?.length && (
              <Button
                noPadding
                noHover
                variant="link"
                fontSize={14}
                id="clear"
                onClick={handleClear}
              />
            )}
          </View>
        </View>
        {loading ? skeleton : <CategoryFilter {...props} {...filterProps} />}
      </View>
    );
  }

  function renderDrawer() {
    return (
      <Hidden mdUp>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <View p={1} style={{ minWidth: 270 }}>
            {renderContent()}
          </View>
        </Drawer>
      </Hidden>
    );
  }

  const skeleton = (
    <View gap={0.75} mt={1} w={'100%'}>
      <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
        <Skeleton width={100} height={20} />
        <Skeleton variant="circle" width={24} height={24} />
      </View>
      <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
        <Skeleton width={100} height={20} />
        <Skeleton variant="circle" width={24} height={24} />
      </View>
    </View>
  );

  return (
    <>
      {renderDrawer()}
      {renderContent()}
    </>
  );
}
