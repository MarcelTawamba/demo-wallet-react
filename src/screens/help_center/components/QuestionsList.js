import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
// import Header from 'components/layout/HeaderNew';
import { arrayToObject } from 'util/general';
import Markdown from 'components/outputs/Markdown';

export default function QuestionsList(props) {
  const { setSectionId, id, config } = props;
  const configObj = arrayToObject(config?.sections, 'id');
  const questionConfig = configObj?.[id] ?? {};
  const { questions, component: Component, md } = questionConfig;

  function handleBack() {
    setSectionId('');
  }
  return (
    <View f={1}>
      {/* <Header handleBack={handleBack} title={id} bold /> */}
      <View scrollView pb={3}>
        {md ? (
          <Markdown>{md}</Markdown>
        ) : Component ? (
          <Component {...props} />
        ) : (
          questions?.map(item => (
            <QuestionListItem {...props} key={item?.id} item={item} />
          ))
        )}
      </View>
    </View>
  );
}

function QuestionListItem(props) {
  const { item, context } = props;
  const { component: Component, condition, description, steps } = item;

  if (typeof Component === 'function') return <Component />;
  return null;
}
