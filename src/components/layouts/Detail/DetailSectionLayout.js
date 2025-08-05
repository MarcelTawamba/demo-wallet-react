import React from 'react';

import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';

const useStyles = makeStyles(theme => ({
  section: {
    width: '100%',
    padding: theme.spacing(1.5),
    paddingLeft: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    // border: ({ variant }) => (variant ? '' : '1px solid #EFEFEF'),
    // backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
    // borderRadius: 10,
    marginBottom: theme.spacing(2),
    backgroundColor: '#FAFAFA',
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: theme.spacing(1), // ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
}));

export default function DetailSectionLayout(props) {
  const { item, section, customer, variant, history, children } = props;

  let { id, label, actions } = section;
  if (!label) label = standardizeString(id);
  const classes = useStyles({ variant });

  return (
    <div className={classes.section}>
      <div className={classes.columns}>
        <Text variant="h6" className={classes.title} id={id ?? label} />
        <DetailActions history={history} actions={actions} />
      </div>
      {children}
    </div>
  );
}

function DetailActions(props) {
  const { actions, history } = props;
  const theme = useMuiTheme();
  const isRtl = theme.direction === 'rtl';

  return (
    <>
      {actions?.length > 0 &&
        actions.map(action => (
          <Button
            history={history}
            noPadding
            size="small"
            variant="outlined"
            color="primary"
            {...action}
            id={action?.id ?? action?.label}
            style={{ [isRtl ? 'marginRight' : 'marginLeft']: 16 }}
          />
        ))}
    </>
  );
}
