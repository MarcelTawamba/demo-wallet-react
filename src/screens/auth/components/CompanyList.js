import React, { Component } from 'react';
import _ from 'lodash';

import { View } from 'components/layout/View';
import List from '@material-ui/core/List';
import CompanyListItem from './CompanyListItem';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import EmptyListMessage from 'components/lists/EmptyListMessage';

class CompanyList extends Component {
  handleCompanySelect(company, props) {
    props.setFieldValue('company', company);
    this.props.handleSubmit(company, props);
  }
  render() {
    const {
      companies,
      formikProps,
      companySearch = '',
      handleStateChange,
    } = this.props;

    let publicCompanies = companies.publicCompanies.filter(company =>
      company.id.includes(companySearch.toLowerCase()),
    );
    let recentCompanies = companies.recentCompanies.filter(company =>
      company.id.includes(companySearch.toLowerCase()),
    );
    publicCompanies = _.differenceBy(publicCompanies, recentCompanies, 'id');

    return (
      <View p={0.5}>
        {recentCompanies &&
        recentCompanies.length &&
        recentCompanies.length > 0 ? (
          <List
            component="nav"
            subheader={
              <View fD={'row'} jC={'space-between'} aI={'center'} h={48}>
                <Text style={{ fontWeight: '500' }} id="history" />
                {recentCompanies.length > 3 && (
                  <Button
                    size={'small'}
                    variant={'text'}
                    noPadding
                    onClick={() => handleStateChange('recent')}
                    id="see_all"
                  />
                )}
              </View>
            }
            disablePadding
            style={{ width: '100%' }}
            // className={classes.root}
          >
            {recentCompanies &&
            recentCompanies.length &&
            recentCompanies.length > 0 ? (
              recentCompanies.map(
                (company, index) =>
                  index < 3 && (
                    <CompanyListItem
                      key={company.id}
                      id={company.id}
                      title={
                        company
                          ? company.name
                            ? company.name
                            : company.id
                          : ''
                      }
                      subtitle={
                        company
                          ? company.description
                            ? company.description
                            : company.id && company.name
                            ? company.id
                            : ''
                          : ''
                      }
                      image={
                        company.icon
                          ? company.icon
                          : company.logo
                          ? company.logo
                          : ''
                      }
                      onClick={() =>
                        this.handleCompanySelect(company.id, formikProps)
                      }
                    />
                  ),
              )
            ) : (
              <EmptyListMessage id="no_recent_wallet_found" />
            )}
          </List>
        ) : null}

        {publicCompanies &&
        publicCompanies.length &&
        publicCompanies.length > 0 ? (
          <List
            component="nav"
            subheader={
              <View fD={'row'} jC={'space-between'} aI={'center'} h={48}>
                <Text style={{ fontWeight: '500' }} id="listed_wallets" />
                {publicCompanies.length > 3 && (
                  <Button
                    size={'small'}
                    variant={'text'}
                    noPadding
                    onClick={() => handleStateChange('public')}
                    id="see_all"
                  />
                )}
              </View>
            }
            style={{ width: '100%' }}
            // className={classes.root}
          >
            {publicCompanies &&
            publicCompanies.length &&
            publicCompanies.length > 0 ? (
              publicCompanies.map(
                (company, index) =>
                  index < 3 && (
                    <CompanyListItem
                      key={company.id}
                      id={company.id}
                      title={
                        company
                          ? company.name
                            ? company.name
                            : company.id
                          : ''
                      }
                      subtitle={
                        company
                          ? company.description
                            ? company.description
                            : company.id && company.name
                            ? company.id
                            : ''
                          : ''
                      }
                      image={
                        company.icon
                          ? company.icon
                          : company.logo
                          ? company.logo
                          : ''
                      }
                      onClick={() =>
                        this.handleCompanySelect(company.id, formikProps)
                      }
                    />
                  ),
              )
            ) : (
              <EmptyListMessage id="no_listed_wallet_found" />
            )}
          </List>
        ) : null}
      </View>
    );
  }
}

export default CompanyList;
