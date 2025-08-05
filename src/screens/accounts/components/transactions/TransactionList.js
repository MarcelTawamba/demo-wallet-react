import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { orderBy } from 'lodash';
import TransactionListItem from './TransactionListItem';
import {
  getTransactions,
  getNextTransactions,
  getPaymentRequests,
} from 'util/rehive';
import { fetchAccounts as _fetchAccounts } from 'screens/accounts/redux/actions';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import ActionList from 'components/lists/ActionList';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExportIcon from '@material-ui/icons/SaveAltOutlined';
import DescriptionIcon from '@material-ui/icons/Description';
import SortContainer from '../filters/SortContainer';
import PageTitle from 'components/layout/page/PageTitle';
import { Button } from 'components/inputs/Button';
import Export from '../filters/Export';
import Statement from '../filters/Statement';
import { TransactionFilterConfig } from '../../config/filters';
import FilterChipList from 'components/filter/FilterChipList';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import TransactionListItemSkeleton from './TransactionListItemSkeleton';
import FilterBar from 'components/filter/FilterBar';
import { searchToObj } from 'util/general';
import { useHistory } from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars-better';
import { useConversionsTransactionList } from 'util/rates';
import StatementWithAccount from '../filters/StatementWithAccount';

const initialFilters = {
  tx_type: { value: 'credit', active: false },
  subtype: { value: '', active: false },
  status: { value: 'Complete', active: false },
  date: { value: { type: 'equal', value: null, value2: null }, active: false },
  amount: {
    value: { type: 'equal', value: '', value2: '' },
    active: false,
  },
};

export default function TransactionList(props) {
  const {
    currency,
    summary,
    account,
    subtypes,
    currencies,
    profile,
    services,
    rates,
    wallet,
    hideHeader,
    alternatingRowColors = true,
  } = props;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextLoading, setNextLoading] = useState(false);
  const [expanded, setExpanded] = useState();
  const [next, setNext] = useState();
  const [field, setField] = useState('created');
  const [direction, setDirection] = useState('desc');
  const [sortActive, setSortActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState();
  const [selected, setSelected] = useState();

  const dispatch = useDispatch();

  const history = useHistory();
  const { search = '' } = history?.location ?? {};

  const hasCurrency = account && currency;
  const currencyObj = hasCurrency
    ? currencies?.accounts?.[account]?.currencies?.[currency]
    : currencies?.primary;

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    _getTransactions();
  }, [currency, account]);

  useEffect(() => {
    setSubtypes();
  }, [subtypes]);

  function fetchAccounts() {
    dispatch(_fetchAccounts());
  }

  function setSubtypes() {
    if (subtypes.length > 0) {
      setFilters({
        ...filters,
        subtype: { ...filters.subtype, value: subtypes[0].value },
      });
    }
  }

  const handleChange = transactionId => (event, expanded) => {
    setSelected(expanded ? transactionId : null);
    setExpanded(expanded ? transactionId : '');
  };

  async function clearAndApply(filter) {
    if (filter === 'all') {
      setFilters(initialFilters);
      setSubtypes();
    } else
      setFilters({
        ...filters,
        [filter]: { ...filters[filter], active: false },
      });

    _getTransactions();
  }

  async function _getTransactions(next) {
    if (next) setNextLoading(true);
    else setLoading(true);

    let data = {};

    if (currency && account)
      data = {
        account,
        currency,
      };

    if (summary) data.page_size = 10;

    const { search = '' } = history?.location ?? {};
    const searchObj = searchToObj(search);

    if (search) data = { ...data, ...(searchObj ?? {}) };

    if (field) data.orderby = (direction === 'asc' ? '' : '-') + field;

    try {
      if (!next) fetchAccounts();
      const _transactions = next
        ? await getNextTransactions()
        : await getTransactions(data);

      const reqFilters = {
        created__gte:
          searchObj?.created__gt ??
          (next &&
            _transactions?.results?.length &&
            _transactions?.results?.[0]?.created),
        created__lte:
          searchObj?.created__lt ??
          (next &&
            _transactions?.results?.length &&
            _transactions?.results?.[_transactions?.results?.length - 1]
              ?.created),
      };

      const requests = search
        ? []
        : services?.payment_requests_service
        ? await getRequests(reqFilters)
        : [];

      const tempTransactions = next ? transactions : [];

      if (isMounted.current) {
        setTransactions([
          ...tempTransactions,
          ..._transactions.results,
          ...(next ? [] : requests ?? []),
        ]);
        setNext(_transactions.next);
      }
    } catch (e) {
      if (e?.status?.toString() === '429') {
        postMessage(JSON.stringify({ rehiveThrottling: true }));
      }
      console.log('getTransactions', e);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setNextLoading(false);
      }
    }
  }

  async function getRequests(date_caps) {
    const { start, end } = date_caps;

    const user = profile?.items ?? {};

    let filters = {
      status: 'initiated',
    };
    if (currency) filters.request_currency = currency;

    if (end) filters.created__lt = end;
    if (start) filters.created__gte = start;

    const requests = await getPaymentRequests(filters);

    if (requests?.data?.results.length) {
      return requests?.data?.results?.map(x => {
        const outgoing = x?.user?.id === user.id;
        const isInvoice = x?.metadata?.service_business?.business?.id ?? false;
        return {
          ...(x ?? {}),
          currency: x?.request_currency,
          amount: x?.request_amount ?? 0,
          total_amount: x?.request_amount ?? 0,
          subtype: isInvoice ? 'invoice' : 'request',
          tx_type: outgoing ? 'neutral_credit' : 'neutral_debit',
          status: 'Pending',
          partner: {
            user: outgoing
              ? x.payer_user ?? {
                  email: x.payer_email,
                  mobile: x.payer_mobile,
                }
              : x.user,
          },
        };
      });
    }
    return [];
  }

  const { conversionRates } = useConversionsTransactionList(
    services,
    rates,
    currency,
    transactions,
  );

  const renderItem = (item, index) => {
    return (
      <TransactionListItem
        profile={profile}
        services={services}
        conversionRates={conversionRates}
        rates={rates}
        expanded={expanded}
        handleChange={handleChange}
        setSelected={setSelected}
        setMenuAnchor={setMenuAnchor}
        refresh={_getTransactions}
        crypto={wallet ? wallet.crypto?.code : ''}
        key={item.id}
        item={item}
        currency={wallet}
        index={index}
        alternatingRowColors={alternatingRowColors}
      />
    );
  };

  const sortProps = {
    field,
    setField,
    direction,
    setDirection,
    setSortActive,
    applySort: _getTransactions,
  };

  const items = orderBy(transactions, ['created'], ['desc']); //filterTransactionCollections(transactions, currency);

  const actions = [
    {
      id: 'filters',
      tooltip: 'filter',
      active: showFilters || history?.location?.search,
      icon: <FilterListIcon />,
      action: () => setShowFilters(!showFilters),
    },
    {
      id: 'sort',
      tooltip: 'sort',
      active: sortActive,
      icon: <SortIcon />,
      content: (
        <SortContainer {...sortProps} onClose={() => setFiltersOpen(false)} />
      ),
    },
    {
      id: 'export',
      tooltip: 'export',
      disabled: !items.length,
      icon: <ExportIcon />,
      content: (
        <Export
          search={search}
          currency={wallet}
          clearAndApply={clearAndApply}
          onClose={() => ActionList.handleClose()}
        />
      ),
    },
    ...(account ? [{
      id: 'statement',
      tooltip: 'Statements',
      disabled: !items.length,
      icon: <DescriptionIcon />,
      content: (
        <StatementWithAccount
          search={search}
          account={account}
          currency={currency || (currencyObj?.currency?.code || '')}
          wallet={wallet}
          currencyObj={currencyObj}
          clearAndApply={clearAndApply}
          onClose={() => ActionList.handleClose()}
        />
      ),
    }] : []),
    {
      id: 'refresh',
      tooltip: 'refresh',
      icon: <RefreshIcon />,
      action: () => {
        _getTransactions();
      },
    },
  ];

  return (
    <React.Fragment>
      {!!!hideHeader && (
        <>
          <PageTitle
            align="left"
            titleId={hasCurrency ? 'history' : 'all_transactions'}
            footer={
              showFilters || history?.location?.search ? (
                <View ph={1}>
                  <FilterBar
                    filterConfig={TransactionFilterConfig({ subtypes })}
                    currency={currencyObj}
                    subtypes={subtypes}
                    profile={profile}
                    fetchData={_getTransactions}
                  />
                </View>
              ) : null
            }
            actions={
              <ActionList
                setOpen={setFiltersOpen}
                open={filtersOpen}
                actions={actions}
              />
            }
          />
          <View ph={1.5}>
            <FilterChipList
              filterConfig={TransactionFilterConfig}
              filters={activeFilters}
              clearAndApply={clearAndApply}
            />
          </View>
        </>
      )}
      {loading ? (
        <View mt={0.5} w={'100%'}>
          <TransactionListItemSkeleton noBorders={!alternatingRowColors} />
          <TransactionListItemSkeleton
            noBorders={!alternatingRowColors}
            gray={alternatingRowColors}
          />
          <TransactionListItemSkeleton noBorders={!alternatingRowColors} />
        </View>
      ) : items && items.length && items.length > 0 ? (
        <Scrollbars
          autoHide
          rtl={document.dir === 'rtl'}
          style={{
            height: '77vh',
          }}>
          <View>
            {items.map((item, index) => renderItem(item, index))}
            {next && !summary && (
              <View w={'100%'} aI={'center'}>
                <Button
                  variant={'text'}
                  color={'primary'}
                  loading={nextLoading}
                  onPress={() => _getTransactions(true)}
                  id="show_more"
                />
              </View>
            )}
          </View>
        </Scrollbars>
      ) : (
        <EmptyListPlaceholderImage name="transaction" id="transactions_empty" />
      )}
    </React.Fragment>
  );
}
