import React, { useState } from 'react';
import { get } from 'lodash';

import CurrentSessionListItem from './CurrentSessionListItem';
import CurrentSessionsSectionListHeader from './CurrentSessionsSectionListHeader';
import List from 'components/lists/List';
import { useDispatch } from 'react-redux';
import { switchAuthSession } from 'redux/auth/actions';

const CurrentSessionsList = props => {
  const {
    items = {},
    companies,
    company,
    setCompany,
    companyID,
    companyOveride,
    history,
    onClose,
  } = props;
  const [sessions, setSessions] = useState(
    Object.values(
      get(items, [companyOveride ? companyOveride : companyID], {}),
    ),
  );
  const dispatch = useDispatch();

  const { recent } = companies;
  if (!recent || !items) {
    return null;
  }

  const data = Object.keys(items).map(item => {
    return {
      company: recent[item],
      data: Object.values(get(items, [item], {})),
      object: items[item],
    };
  });

  const index = data.findIndex(
    item =>
      get(item, ['company', 'id']) ===
      (companyOveride ? companyOveride : companyID),
  );
  data.unshift(data.splice(index, 1)[0]);

  function handleCompanySelect(item) {
    if (item.data.length > 1) {
      setCompany(item.company);
      setSessions(item.data);
    } else {
      const userID = get(item, ['data', 0, 'user', 'id']);
      dispatch(
        switchAuthSession(item.company, get(item, ['data', 0, 'user', 'id'])),
      );
      navigateAuth(item.company.id, userID);
    }
  }

  function navigateAuth(companyID, userID) {
    history.push('/' + companyID + '/?user=' + userID);

    if (onClose) onClose();
  }

  if (company) {
    return (
      <React.Fragment>
        <List
          renderItem={({ item, index }) => (
            <CurrentSessionListItem
              companyID={company.id}
              key={get(item, ['user', 'id'], index)}
              item={item}
              navigateAuth={navigateAuth}
            />
          )}
          data={sessions}
        />
      </React.Fragment>
    );
  } else {
    return (
      <List
        renderItem={({ item, index }) => (
          <CurrentSessionsSectionListHeader
            selected={get(item, ['company', 'id']) === companyID}
            item={item}
            onPress={handleCompanySelect}
            key={get(item, ['company', 'name'], index)}
          />
        )}
        data={data}
        keyExtractor={item => get(item, ['company', 'name'])}
      />
    );
  }
};

export default CurrentSessionsList;
