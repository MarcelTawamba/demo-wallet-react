import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { objectToArray } from 'util/general';
import Tabs from 'components/menu/Tabs';
import ScreenTabs from 'components/layouts/Screen/Header/TabsNew';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import ChevronForwardIcon from '@material-ui/icons/ChevronRight';
import FormActions from './FormActions';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // paddingRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'flex-end',
  },
  tabs: {
    display: 'flex',
    height: 40,
    // paddingBottom: theme.spacing(1),
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    marginBottom: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    // height: 40,
    width: '100%',
    // marginBottom: theme.spacing(0.5),
    // paddingRight: theme.spacing(1),
    // paddingLeft: theme.spacing(1),
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  titleContainer: {
    // paddingBottom: theme.spacing(0.5),
  },
  extraContainer: {
    width: '100%',
    paddingRight: theme.spacing(1),
  },
  actions2: { paddingLeft: theme.spacing(1) },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
  },
  row2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // justifyContent: 'flex-end',
    width: '100%',
    // position: 'relative',
    paddingBottom: ({ singleTab }) => theme.spacing(singleTab ? 0.5 : 0),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
  },
  description: { paddingBottom: theme.spacing(0.5) },
  root: { paddingBottom: theme.spacing(1) },
}));

export default function TabHeader(props) {
  let {
    title,
    pageId,
    filters,
    history,
    isValid,
    tabs,
    isNumberedTab,
    screenId,
    itemId,
    tabId,
    setTabId,
    onSubmit,
    inputPropsControl,
    screenConfig,
    component,
    formConfig,
    formMethods,
    hideActions,
  } = props;
  const { saveLabel = 'save', validation, description } = formConfig;

  const isSubmitting = inputPropsControl?.formState?.isSubmitting ?? false;

  const singleTab = tabs?.length === 1;
  const showTabs = !singleTab || tabs?.length > 1;
  const classes = useStyles({ singleTab });

  if (singleTab) {
    tabs = objectToArray(screenConfig?.pages, 'id');
  }

  function handleBack() {
    history.push(
      '/' +
        screenId +
        '/' +
        (pageId ? pageId + '/' : '') +
        (itemId ? itemId + '/' : ''),
    );
  }

  let actions = [
    // { label: 'Preview', variant: 'text' },
    { id: 'cancel', variant: 'outlined', onPress: handleBack },
  ];
  if (formConfig?.actions?.length) {
    actions = actions.concat(formConfig?.actions);
  }
  let isValidation = true;
  if (typeof validation === 'function') {
    const values = formMethods.getValues();
    isValidation = validation({ values });
  }
  actions.push({
    id: saveLabel,
    type: 'submit',
    onPress: onSubmit,
    disabled: !isValid || !isValidation,
    loading: isSubmitting,
  });
  const isRtl = document.dir === 'rtl';

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.column}>
          <div className={classes.row2}>
            {isRtl ? (
              <ChevronForwardIcon
                onClick={handleBack}
                style={{
                  fontSize: 26,
                  color: '#222',
                  cursor: 'pointer',
                  margin: '-1px -4px 0px 6px',
                }}
              />
            ) : (
              <ChevronBackIcon
                onClick={handleBack}
                style={{
                  fontSize: 26,
                  color: '#222',
                  cursor: 'pointer',
                  margin: '-1px 6px 0px -4px',
                }}
              />
            )}
            <Text s={20} c="fontDark" fontWeight={500} id={title} />
          </div>

          {showTabs && (
            <div className={classes.tabs}>
              {!singleTab ? (
                <Tabs
                  variant="link"
                  tabs={tabs.map(value => ({
                    value: value?.value ?? value,
                    label: value?.label ?? value,
                  }))}
                  isNumberedTab={isNumberedTab}
                  state={tabId}
                  onChange={setTabId}
                />
              ) : tabs?.length > 1 ? (
                <div style={{ paddingTop: 8 }}>
                  <ScreenTabs
                    history={history}
                    tabId={pageId}
                    screenId={screenId}
                    // onChange={onChange}
                    tabs={tabs}
                    // defaultTab={defaultPage}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
        {!hideActions && <FormActions {...props} />}
      </div>

      {description && (
        <div className={classes.description}>
          <Text id={description} />
        </div>
      )}
    </div>
  );
}
