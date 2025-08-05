import React, { useState, useCallback } from 'react';
import { get } from 'lodash';

import { View } from 'components/layout/View';
import ButtonList from 'components/lists/ButtonList';
import PageTitle from 'components/layout/page/PageTitle';
import RadioSelector from 'components/inputs/RadioSelector';
import Output from 'components/outputs/Output';
import { createExport } from 'util/rehive';
import ExportList from './ExportList';
import { searchToObj } from 'util/general';

const Export = ({ search, currency }) => {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('csv');

  const createNewExport = useCallback(async () => {
    setLoading(true);
    try {
      let mappedFilters = {
        ...searchToObj(search),
        account: get(currency, 'account', ''),
        currency: get(currency, ['currency', 'code'], ''),
      };
      const resp = await createExport('transaction', mappedFilters, exportType);
      setState('');
    } catch (error) {
      console.error('Failed to create export:', error);
    } finally {
      setLoading(false);
    }
  }, [currency, exportType, search]);

  return (
    <View>
      <PageTitle titleVariant={'h6'} titleId="export" />
      {state === 'new' ? (
        <View w={'100%'}>
          <View ph={1.5} w={'100%'}>
            <RadioSelector
              title="file_format"
              items={[
                { value: 'csv', label: 'CSV' },
                { value: 'json', label: 'JSON' },
              ]}
              value={exportType}
              handleChange={event => setExportType(event.target.value)}
            />
            <Output label="filters" value={search} />
          </View>
          <View w={'100%'} aI={'flex-end'}>
            <ButtonList
              items={[
                {
                  id: 'cancel',
                  capitalize: true,
                  variant: 'text',
                  onPress: () => setState(''),
                },
                {
                  id: 'export',
                  capitalize: true,
                  color: 'primary',
                  loading,
                  variant: 'text',
                  onPress: createNewExport,
                },
              ]}
              layout={'material'}
            />
          </View>
        </View>
      ) : (
        <React.Fragment>
          <ExportList />
          <View w={'100%'} aI={'flex-end'}>
            <ButtonList
              items={[
                {
                  id: 'new_export',
                  capitalize: true,
                  color: 'primary',
                  variant: 'text',
                  onPress: () => setState('new'),
                },
              ]}
              layout={'material'}
            />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};

export default Export;
