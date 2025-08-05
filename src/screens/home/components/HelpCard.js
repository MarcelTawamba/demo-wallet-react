import React from 'react';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Icon from 'components/rehive/IconNew';

const size = 40;
const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 8,
    padding: 8,
    width: '100%',
  },
  title: {
    marginLeft: 10,
  },
  icon: {
    height: size,
    width: size,
    maxHeight: size,
    maxWidth: size,
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function HelpCard(props) {
  const classes = useStyles();
  const links = [
    {
      id: 1,
      title: 'frequently_asked_questions',
      to: '/help/faqs/',
      image: 'faq',
    },
    { id: 2, title: 'contact_support', to: '/help/', image: 'support' },
    { id: 3, title: 'about_us', to: '/help/about/', image: 'about' },
  ];
  return (
    <div className={classes.container}>
      <View bC={'primary'} bR={8} w="100%" pv={1} ph={1.5}>
        <Text
          fontWeight={500}
          s={18}
          c="#ffffff"
          style={{ marginBottom: 6 }}
          id="how_can_we_help"
        />
        {links.map(link => (
          <Link key={link.id} to={link.to}>
            <View fD="row" aI="center">
              <div className={classes.icon}>
                <Icon icon={link.image} size={32} color="white" />
              </div>
              <Text c="#ffffff" className={classes.title} id={link.title} />
            </View>
          </Link>
        ))}
      </View>
    </div>
  );
}
