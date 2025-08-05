import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  getPublicCompanies,
  getPublicCompany,
  getCompanyAppConfig,
} from 'util/rehive';
import { setTempCompany } from 'redux/auth/actions';
import CompanyForm from './CompanyForm';
import { useHistory } from 'react-router-dom';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { useQuery } from 'react-query';

export default function CompanyPage(props) {
  const { companies, onSuccess, loading, setLoading } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState('');
  let { config: client } = useConfiguration();

  const queryPublicCompanies = useQuery(
    ['publicCompanies'],
    getPublicCompanies,
  );

  const publicCompanies = queryPublicCompanies?.data?.results ?? [];

  async function verifyCompany(company) {
    setLoading(true);
    if (!company) {
    } else {
      company = company.toLowerCase();
      try {
        const response = await getPublicCompany(company);
        const config = await getCompanyAppConfig(company, false);
        if (response.status === 'success' && config?.status === 'success') {
          dispatch(
            setTempCompany({ ...response.data, ...(config?.data ?? {}) }),
          );
          if (client.company) {
            history.push('/');
          } else {
            history.push('/' + company + '/');
          }
          onSuccess();
        } else {
          setError('Please enter a valid App ID');
        }
      } catch (error) {
        console.log('TCL: verifyCompany -> error', error);
      }
    }
    setLoading(false);
  }

  function handleSubmit(company) {
    setLoading(true);
    verifyCompany(company);
  }

  if (loading) {
    return <div />;
  }

  return (
    <CompanyForm
      {...props}
      companies={{ ...companies, publicCompanies }}
      handleSubmit={handleSubmit}
      error={error}
    />
  );
}
