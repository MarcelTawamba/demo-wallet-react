import React from 'react';

import Accordion from './AccordionItem';

import SectionList from './SectionList';

import ConfigList from './ConfigList';

import { standardizeString } from 'util/general';
import Resource from './Resource';
import Component from './Component';
import Feature from './FeatureItem';
import UtilItem from './UtilItem';
import PagesList from './PagesList';

export default function DocumentSections(props) {
  return <SectionList {...props} component={Section} />;
}

function Section(props) {
  const { item, id, sectionId, level } = props;
  const open = id === sectionId || level < 1 || id === 'pages';
  const { title } = item;

  function Content() {
    switch (id) {
      case 'features':
        return <SectionList component={Feature} item={item} />;
      case 'config':
        return <ConfigList item={item} />;
      case 'util':
        return <SectionList component={UtilItem} item={item} />;
      case 'components':
        return <SectionList component={Component} item={item} />;
      case 'pages':
        return <PagesList component={Component} item={item} />;
      default:
        return <Resource {...props} item={item} level={level + 1} />;
    }
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <Accordion
        title={title ?? standardizeString(id)}
        initialOpen={open}
        titleVariant={level === 0 ? 'h3' : level === 1 ? 'h5' : 'h6'}>
        {Content()}
      </Accordion>
    </div>
  );

  // return (
  //   <div style={{ paddingTop: 24 }}>
  //     <Accordion
  //       title={title}
  //       // initialOpen={sectionId && sectionId === id}
  //       titleVariant={child ? 'h4' : 'h3'}>
  //       <div style={{ paddingBottom: 24 }}>
  //         {Boolean(description) && <Text paragraph>{description}</Text>}
  //         {main ? (
  //           <ScreenList items={children} />
  //         ) : !child ? (
  //           <DocumentSections child items={children} />
  //         ) : null}
  //       </div>
  //     </Accordion>
  //   </div>
  // );
}
