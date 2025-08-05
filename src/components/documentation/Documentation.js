import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Resource from './Resource';
import Text from 'components/outputs/Text';

export default function Documentation(props) {
  const { config } = props;
  const location = window.location;
  const { pathname } = location;
  const paths = pathname.split('/');
  const screen = paths.length > 3 ? paths[2] : '';
  const section = paths.length > 4 ? paths[3] : '';

  const currentPage = screen ? config?.children?.[screen] : config;
  const currentSection = section ? currentPage?.children?.[section] : null;
  const currentContent = currentSection ?? currentPage;

  const { title } = currentContent;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Text variant="h2" gutterBottom>
        {title}
      </Text>
      <Resource
        id={screen}
        screenId={screen}
        sectionId={section}
        item={currentContent}
        level={0}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(6),
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
}));
