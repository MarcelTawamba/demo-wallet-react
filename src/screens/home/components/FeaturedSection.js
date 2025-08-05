import React from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { useQuery } from 'react-query';
import Grid from '@material-ui/core/Grid';

export default function FeaturedSection(props) {
  const {
    id,
    company,
    section,
    renderItem,
    dataFunction = () => {},
    redirect = () => {},
    itemCount = 3,
  } = props;

  const dataQuery = useQuery([id, company?.id], dataFunction, {
    enabled: Boolean(company?.id),
  });

  const loading = !dataQuery || dataQuery?.isLoading;

  const results = dataQuery?.data?.data?.results;

  const content = (
    <Grid item xs={12}>
      {!loading && results?.length && (
        <Grid item xs={12}>
          <View mb={1} fD={'row'} aI={'flex-end'} jC={'space-between'}>
            <Text
              id="featured_section"
              context={{ section }}
              fontWeight={500}
              style={{ fontSize: 18 }}
            />
            <Button
              variant={'link'}
              color={'primary'}
              textProps={{ fontSize: 14 }}
              onPress={redirect}>
              <Text id="view_more" c="primary" />
            </Button>
          </View>
        </Grid>
      )}
      <Grid container spacing={3}>
        {(results ?? new Array(itemCount).fill(0))?.map((args, index) => {
          const { key, ...restArgs } = args || {};
          const itemKey = key || index;
          return React.cloneElement(
            renderItem({
              ...restArgs,
              loading,
            }),
            { key: itemKey }
          );
        })}
      </Grid>
    </Grid>
  );

  return !loading && !results?.length ? null : content;
}
