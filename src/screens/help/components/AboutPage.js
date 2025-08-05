import React from 'react';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
// import PageTitle from 'components/layout/page/PageTitle';
import OutputList from 'components/lists/OutputList';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';

export default function AboutPage(props) {
  const { context, history } = props;
  const { company } = context;

  let { config: client } = useConfiguration();

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

  // const titleObj = {
  //   title: name,
  //   // subtitle: id,
  //   titleScale: 'h4',
  //   align: 'center',
  //   noPadding: true,
  //   image: company.icon ? company.icon : company.logo,
  // };

  let outputs = [{ label: '', value: description, align: 'center' }];

  // if (website) {
  outputs.push({
    id: 'website',
    value: website,
    link: website,
    placeholderId: 'not_yet_provided',
  });
  // }
  // if (country) {
  outputs.push({
    id: 'country',
    label: 'country',
    value: country,
    placeholderId: 'not_yet_provided',
    placeholder: 'Not yet provided',
  });
  // }

  // if (support_email) {
  outputs.push({
    id: 'support_email',
    label: 'Support email',
    value: support_email,
    fullLink: support_email ? `mailto:${support_email}` : '',
    placeholderId: 'not_yet_provided',
    placeholder: 'Not yet provided',
  });
  // }

  // if (support_link) {
  outputs.push({
    id: 'support_link',
    label: 'Support website',
    value: support_website,
    link: support_website,
    placeholderId: 'not_yet_provided',
  });
  // }

  let buttons = [
    {
      id: 'privacy_policy',
      label: 'Privacy policy',
      link: privacy_policy_url ? privacy_policy_url : client.privacy_policy_url,
      variant: 'link',
      color: 'primary',
      history,
    },
    {
      id: 'terms_of_use',
      label: 'Terms of use',
      link: terms_and_conditions_url
        ? terms_and_conditions_url
        : client.terms_and_conditions_url,
      variant: 'link',
      color: 'primary',
      history,
    },
  ].filter(x => x.link);

  return (
    <View p={1}>
      <View ph={1}>
        {/* <PageTitle {...titleObj} /> */}
        <OutputList items={outputs} outputProps={{ labelColor: '#222222' }} />
      </View>
      <View w={'100%'} fD={'row'} jC={'space-between'} aI={'center'} p={1}>
        {buttons.map(button => (
          <Button
            key={button.id}
            href={button.link}
            variant={button.variant}
            newTab>
            <Text id={button.id} variant="s2" color="primary" opacity={0.8} />
          </Button>
        ))}
      </View>
    </View>
  );
}
