import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import DetailSection from './DetailSection';
import DetailSkeleton from './DetailSkeleton';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    width: '100%',
  },
  component: {
    width: '100%',
    height: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 650,
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 300,
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 300,
    overflow: 'scroll',
  },
  section: {
    width: '100%',
    padding: theme.spacing(1.5),
    paddingLeft: ({ variant = true }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ variant = true }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    border: ({ variant = true }) => (variant ? '' : '1px solid #EFEFEF'),
    backgroundColor: ({ variant = true }) => (variant ? '#FAFAFA' : '#FFFFFF'),
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: ({ variant = true }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant = true }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  columnsVariants: {
    display: 'flex',
    flexDirection: 'columns',
    justifyContent: 'space-between',
    paddingTop: ({ variant = true }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant = true }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  footerOutput: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingTop: 0,
  },
}));

export default function Detail(props) {
  const { detailConfig = {}, item } = props;
  const {
    renderFooter,
    renderHeader,
    sections = [],
    variant = true,
    skeleton,
  } = detailConfig;

  const classes = useStyles();

  if (!item) {
    return <DetailSkeleton variant skeleton={skeleton} />;
  }

  return (
    <>
      {Boolean(renderHeader) ? renderHeader(props) : null}
      {sections.map(section => (
        <DetailSection
          key={section?.id ?? section}
          section={section}
          variant={variant}
          {...props}
        />
      ))}

      {Boolean(renderFooter) && renderFooter(props)}
    </>
  );
}
