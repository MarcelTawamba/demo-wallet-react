import React, { useState } from 'react';
import LinkList from './components/LinkList';
import QuestionsList from './components/QuestionsList';
import pages from './pages';
import { useRehive } from 'hooks/rehive';
import { useSelector } from 'react-redux';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import { View } from 'components/layout/View';
import PageTitle from 'components/layout/page/PageTitle';

const config = {
  order: ['depositing_money', 'withdrawing_money'],
  tabs: pages,
};

export default function HelpCenterPage(props) {
  const { params, sectionId, setSectionId } = props;
  const services = useSelector(currentCompanyServicesSelector);

  const [tabId, setTabId] = useState(params?.tab ?? config?.order?.[0] ?? '');
  const tabConfig = config?.tabs?.[tabId] ?? {};

  // const [sectionId, setSectionId] = useState('');

  const {
    context: { companyBankAccounts },
  } = useRehive(['companyBankAccounts']);
  const context = { services, companyBankAccounts };

  // function handleChange(tabId, sectionId){
  //   setTabId(tabId)
  //   setSectionId(sectionId)
  // }

  return (
    <View bC={'white'}>
      {sectionId ? (
        <>
          <PageTitle
            noPadding
            titleId={sectionId}
            titleVariant="h6"
            // align="left"
          />
          <QuestionsList
            context={context}
            setTabId={setTabId}
            setSectionId={setSectionId}
            id={sectionId}
            config={tabConfig}
          />
        </>
      ) : (
        <>
          {/* <Header  title="having_trouble_" bold /> */}
          <View scrollView pt={1}>
            {/* <SearchBox /> */}
            {/* <TabBar
              items={config?.order}
              selected={tabId}
              onSelect={setTabId}
            /> */}
            <LinkList
              context={context}
              id={tabId}
              config={tabConfig}
              onSelect={setSectionId}
            />
          </View>
        </>
      )}
    </View>
  );
}
