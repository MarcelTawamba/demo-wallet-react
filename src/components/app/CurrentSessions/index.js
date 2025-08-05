import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get, isEmpty } from 'lodash';

import CurrentSessionsList from './CurrentSessionsList';
import {
  currentSessionsSelector,
  companiesSelector,
} from 'redux/auth/selectors';
import DrawerTitle from 'components/layout/drawer/DrawerTitle';
import makeStyles from '@material-ui/styles/makeStyles';
import ListItem from 'components/outputs/ListItem';
import { logout } from 'util/rehive';
import { removeAllAuthSessions } from 'redux/auth/actions';
import { useHistory } from 'react-router-dom';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { standardizeString } from 'util/general';

const CurrentSessions = props => {
  const {
    hideSessions,
    hideApps,
    onClose,
    companyOveride,
    hideAdd,
    isAuth,
  } = props;
  const currentSessions = useSelector(currentSessionsSelector);
  const { companyID, items } = currentSessions;
  const hideLogout = isEmpty(items);
  const companies = useSelector(companiesSelector);
  const history = useHistory();
  let { config: client } = useConfiguration();

  const [company, setCompany] = useState(
    get(companies, ['recent', client.company]),
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  function handleLogoutAll() {
    try {
      logout();
      dispatch(removeAllAuthSessions());
    } catch (error) {
      console.log(error);
      if (error.message === 'Invalid token.') {
        dispatch(removeAllAuthSessions());
      }
    }
    if (onClose) onClose();
  }

  function handleNewAuth(company) {
    history.push('/' + (company ? company : 'company') + '/');
    if (onClose) onClose();
  }

  const listProps = {
    company,
    setCompany,
    hideApps,
    onClose,
    hideSessions,
    items,
    companies,
    companyOveride,
    companyID,
    history,
  };
  const colorsOveride = get(company, ['config', 'colors']);
  const hasCompany = Boolean(company);

  return (
    <div className={classes.container}>
      {hasCompany && !hideApps && (
        <DrawerTitle
          colorsOveride={colorsOveride}
          title={company?.name ?? standardizeString(company?.id)}
          onBack={() => setCompany(null)}
        />
      )}

      <CurrentSessionsList {...listProps} />

      <React.Fragment>
        {!hideAdd && !isAuth && (
          <ListItem
            button
            onClick={() => handleNewAuth(company ? company.id : companyID)}
            titleId="add_session"
            icon="plus"
            color="primary"
          />
        )}
        {!hideAdd && !hasCompany && !hideApps && (
          <ListItem
            button
            onClick={() => handleNewAuth()}
            titleId="add_app"
            icon="plus"
            color="primary"
          />
        )}
        {!hasCompany && !hideLogout && (
          <ListItem
            button
            // inverted
            color="error"
            onClick={() => handleLogoutAll()}
            titleId="logout_all"
            icon="exit"
          />
        )}
      </React.Fragment>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#FFF',
  },
}));

export default CurrentSessions;
