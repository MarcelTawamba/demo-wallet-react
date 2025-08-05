import React from 'react';

import PageFeaturesList from './PageFeaturesList';
import Text from 'components/outputs/Text';

import Accordion from './AccordionItem';
import ConfigList from './ConfigList';
import { standardizeString } from 'util/general';
import ComponentList from './ComponentList';
import UtilList from './UtilItem';
export default function ScreenList(props) {
  const { items } = props;
  if (!items) return null;
  const keys = Object.keys(items);
  if (keys.length === 0) return null;

  return keys.map(key => <Screen key={key} id={key} item={items[key]} />);
}

function Screen(props) {
  const { id, item } = props;
  const { title, description } = item;

  function Content() {
    switch (id) {
      case 'features':
        return <PageFeaturesList item={item} />;
      case 'config':
        return <ConfigList item={item} />;
      case 'util':
        return <UtilList item={item} />;
      case 'components':
        return <ComponentList item={item} />;
      default:
        return (
          <div style={{ paddingBottom: 48 }}>
            {Boolean(description) && <Text paragraph>{description}</Text>}
          </div>
        );
    }
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <Accordion
        title={title ?? standardizeString(id)}
        initialOpen
        titleVariant="h5">
        {Content()}
      </Accordion>
    </div>
  );
}
