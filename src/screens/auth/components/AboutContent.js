import React from 'react';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { getEnvVar } from '../../../utils/env';
import Title from 'components/outputs/Title';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import OutputList from 'components/lists/OutputList';
import PageTitle from 'components/layout/page/PageTitle';
import { getName } from 'country-list';

const AboutContent = props => {
  const { company, onBack } = props;
  const {
    id,
    name,
    description,
    country,
    support_website,
    settings,
    support_email,
    website,
  } = company;
  const { privacy_policy_url, terms_and_conditions_url } = settings;
  let { config: client } = useConfiguration();

  const titleObj = {
    title: name,
    // subtitle: id,
    titleScale: 'h4',
    // subtitleScale: 'h6',
    back: true,
    // align: 'left',
    noPadding: true,
    handleBack: onBack,
    image: company.icon ? company.icon : company.logo,
  };

  let outputs = [{ label: '', value: description }];

  // if (website) {
  outputs.push({
    id: 'website',
    value: website,
    link: website,
    placeholderId: 'not_yet_provided',
  });
  // }
  if (country) {
    outputs.push({
      id: 'country',
      value: getName(country),
    });
  }

  // if (support_email) {
  outputs.push({
    id: 'support_email',
    value: support_email,
    // link: support_email,
    placeholderId: 'not_yet_provided',
  });
  // }

  // if (support_website) {
  outputs.push({
    id: 'support_website',
    value: support_website,
    link: support_website,
    placeholderId: 'not_yet_provided',
  });
  // }

  // Add version information if VERSION env var exists
  const version = getEnvVar('VERSION');
  if (version) {
    outputs.push({
      id: 'version',
      value: version,
      placeholderId: 'not_yet_provided',
    });
  }

  let buttons = [
    {
      id: 'privacy_policy',
      link: privacy_policy_url ? privacy_policy_url : client.privacy_policy_url,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'terms_of_use',
      link: terms_and_conditions_url
        ? terms_and_conditions_url
        : client.terms_and_conditions_url,
      variant: 'text',
      color: 'primary',
    },
  ];

  return (
    <React.Fragment>
      <div>
        <PageTitle {...titleObj} />
        <OutputList items={outputs} />
      </div>
      <View
        w={'100%'}
        fD={'row'}
        jC={'space-between'}
        aI={'center'}
        p={1}
        pb={0}>
        {buttons.map(button => (
          <Button
            key={button.id}
            href={button.link}
            variant={button.variant}
            newTab>
            <Text variant="s2" color="primary" opacity={0.8} id={button.id} />
          </Button>
        ))}
      </View>
    </React.Fragment>
  );
};

export default AboutContent;
