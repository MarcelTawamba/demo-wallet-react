import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Text from './Text';

const styles = theme => ({
  listItem: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700',
    fontSize: '1rem',
  },
});

const options = ({ textColor = 'font' }) => ({
  overrides: {
    h1: {
      component: Text,
      props: {
        gutterBottom: true,
        variant: 'h5',
      },
    },
    h2: { component: Text, props: { variant: 'h6' } },
    h3: {
      component: Text,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Text,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: {
      component: Text,
      props: { paragraph: true, myColor: textColor },
    },
    span: {
      component: Text,
      props: { paragraph: true, myColor: textColor },
    },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Text component="span" myColor={textColor} {...props} />
        </li>
      )),
    },
  },
});

export default function Markdown(props) {
  // Ensure children is a string to prevent "Cannot read properties of null (reading 'replace')" error
  const safeChildren = props.children ? props.children : '';
  return <ReactMarkdown skipHtml options={options(props)} {...props} children={safeChildren} />;
}
