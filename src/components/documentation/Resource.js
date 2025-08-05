import React from 'react';
import { makeStyles } from '@material-ui/styles';
import DocumentSections from './DocumentSections';
import Text from 'components/outputs/Text';

const styles = {
  screen: {
    titleVariant: 'h2',
    subtitleVariant: 'h4',
  },
  section: {
    titleVariant: 'h5',
    subtitleVariant: 'h6',
  },
};

export default function Resource(props) {
  const { item, level } = props;
  const classes = useStyles();
  const { subtitle, description, children } = item;
  const variant = level === 0 ? 'screen' : level === 1 ? 'section' : '';
  const { subtitleVariant = 'h5' } = styles[variant] ?? {};

  return (
    <div className={classes.container}>
      <Text variant={subtitleVariant} gutterBottom paragraph>
        {subtitle}
      </Text>
      <Text paragraph>{description}</Text>
      <DocumentSections variant={variant} {...props} item={children} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  main: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(6),
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
}));
