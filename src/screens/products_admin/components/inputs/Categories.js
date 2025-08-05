import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { getProductCategories } from 'util/rehive';
import { arrayToObject } from 'util/general';
import Spinner from 'components/outputs/Spinner';
import CheckboxMultiList from 'components/inputs/CheckboxMultiList';
import Modal from 'components/layout/Modal';
import { Button } from 'components/inputs/Button';
import { useQuery } from 'react-query';
import Group from 'components/form/Group';
import Text from 'components/outputs/Text';
import PageContent from 'components/layout/page/PageContent';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useSelector } from 'react-redux';

export default function Categories(props) {
  const { setValue, name, context } = props;

  // const [loading, setLoading] = useState(true);
  // const [categories, setCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const company = useSelector(currentCompanySelector);

  useEffect(() => {
    setValues(context?.item?.categories ?? []);
  }, [context?.item?.categories]);

  useEffect(() => {
    setValue(name, values);
  }, [values]);

  const classes = useStyles();

  // useEffect(() => {
  //   setLoading(true);
  //   async function fetchData() {
  //     const resp = await getProductCategories();
  //     const results = get(resp, ['data', 'results'], []);

  //     setCategories(results);
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);

  const { data: dataCategories, isLoading } = useQuery(
    [company?.id, 'sellers'],
    () => getProductCategories('?page_size=250'),
    {
      enabled: Boolean(company?.id),
    },
  );

  const categories = dataCategories?.results;
  const categoriesObj = arrayToObject(categories, 'id');

  const valuesString = values?.length
    ? values.map(
        (item, index) =>
          (index > 0 ? ', ' : '') +
          (item?.name ?? categoriesObj?.[item]?.name ?? ''),
      )
    : 'None';

  return (
    <>
      <Group label="Categories">
        <div className={classes.row}>
          <Text>{valuesString}</Text>
          <Button
            noPadding
            size="small"
            onPress={e => {
              e.preventDefault();
              e.stopPropagation();
              setShowModal(true);
            }}
            variant="link"
            color="primary"
            id="change"
          />
        </div>
      </Group>
      <Modal
        altStyle
        close
        open={showModal}
        // onClose={() => setShowModal(false)}
        onDismiss={() => setShowModal(false)}
        title="select_categories">
        <PageContent horizontal={3}>
          {isLoading ? (
            <Spinner size={24} />
          ) : (
            <CheckboxMultiList
              openable
              open={open}
              setOpen={setOpen}
              items={categories}
              parent={''}
              values={values}
              setValue={setValues} //handleValueChange}
            />
          )}
        </PageContent>
      </Modal>
    </>
  );
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
}));
