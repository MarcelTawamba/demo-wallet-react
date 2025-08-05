import React, { useMemo, useState } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import ExpansionPanel from 'components/layout/ExpansionPanel';
import Icon from 'components/outputs/NewIcon';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import i18n from 'util/i18n';
import { sortBy } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function FAQsPage(props) {
  const classes = useStyles();
  const { context } = props;
  const { faqConfig } = context;
  const { questions, description } = faqConfig;
  const [expanded, setExpanded] = useState();
  const [selectedCategory, setSelectedCategory] = useState(); // for new FAQ config
  const appLanguageKey = i18n.language ?? 'en';
  const isLegacyConfig = useMemo(
    () => Boolean(faqConfig && !faqConfig.en),
    [faqConfig],
  );

  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  function renderSummary({ question, index }) {
    return (
      <View flex fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
        <Text bold>{question['en'].question}</Text>
        <Icon
          icon={expanded === index ? 'remove' : 'add'}
          circled={false}
          color={'grey3'}
        />
      </View>
    );
  }

  const legacyConfigContent = () => {
    return questions?.length ? (
      questions.map((question, index) => (
        <ExpansionPanel
          expanded={expanded === index}
          onChange={() => setExpanded(expanded === index ? -1 : index)}
          summary={renderSummary({ question, index })}
          detail={<Text myColor={'grey4'}>{question['en'].answer}</Text>}
        />
      ))
    ) : (
      <EmptyListMessage id={'faqs_empty'} />
    );
  };

  const newConfigContent = () => {
    let sortedFaqConfig = faqConfig?.[appLanguageKey]?.categories;
    try {
      if (sortedFaqConfig?.length) {
        sortedFaqConfig = sortBy(sortedFaqConfig, 'index');
        sortedFaqConfig.forEach(item => {
          item.questions = sortBy(item?.questions, 'index');
        });
      }
    } catch (error) {}
    return selectedCategory ? (
      <CategoryDetails
        category={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    ) : (
      <View w={'100%'}>
        {sortedFaqConfig?.length > 0 ? (
          <List
            component="nav"
            className={classes.root}
            aria-label="mailbox folders">
            {sortedFaqConfig?.map((category, index) => (
              <View key={index}>
                <ListItem button onClick={() => handleCategorySelect(category)}>
                  <ListItemText
                    primary={category.name}
                    primaryTypographyProps={{ style: { fontWeight: 500 } }}
                  />
                  <ChevronRightIcon style={{ color: '#797979' }} />
                </ListItem>
                <Divider />
              </View>
            ))}
          </List>
        ) : (
          <EmptyListMessage id={'faqs_empty'} />
        )}
      </View>
    );
  };

  return (
    <View p={1} ph={2}>
      {Boolean(description) && (
        <View mb={isLegacyConfig ? 1.5 : 0.75}>
          <Text style={{ textAlign: 'center' }} myColor={'grey4'}>
            {description}
          </Text>
        </View>
      )}
      {isLegacyConfig ? legacyConfigContent() : newConfigContent()}
    </View>
  );
}

function CategoryDetails({ category, setSelectedCategory }) {
  const [activeIndex, setActiveIndex] = useState();

  const resetSelectedCategory = () => setSelectedCategory(null);

  function renderSummary(question, index) {
    return (
      <View flex fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
        <Text bold s={15}>
          {question.title}
        </Text>
        <Icon
          icon={activeIndex === index ? 'remove' : 'add'}
          circled={false}
          color={'grey3'}
        />
      </View>
    );
  }

  function renderDetails(question) {
    return (
      <View w={'100%'} style={{ marginTop: -18 }}>
        {question?.answers?.map((answer, index) => (
          <View key={index} mv={0.65}>
            <Text bold s={14}>
              {answer.title}
            </Text>
            <Text s={14} style={{ marginTop: 4 }} myColor={'grey4'}>
              {answer.text}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View w="100%">
      <View
        fD="row"
        style={{ cursor: 'pointer' }}
        onClick={resetSelectedCategory}>
        <ChevronLeftIcon
          style={{ color: '#797979', marginLeft: -6 }}
          fontSize="small"
        />
        <Text id="back" s={14} c="primary" style={{ marginLeft: 4 }} />
      </View>
      <Text bold style={{ marginTop: 16, marginBottom: 16 }}>
        {category.name}
      </Text>
      {category?.questions.map((question, index) => (
        <ExpansionPanel
          expanded={activeIndex === index}
          onChange={() => setActiveIndex(activeIndex === index ? -1 : index)}
          summary={renderSummary(question, index)}
          detail={renderDetails(question)}
        />
      ))}
    </View>
  );
}
