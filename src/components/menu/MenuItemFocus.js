import React from 'react';
import Text from 'components/outputs/Text';
import { Link } from 'react-router-dom';
import SubMenu from './SubMenu';
import SubMenuItem from './SubMenuItem';
import makeStyles from '@material-ui/styles/makeStyles';
import Hover from 'components/layout/Hover';
import Icon from 'components/rehive/Icon';
import { standardizeString } from 'util/general';

const MenuItemFocus = props => {
  const classes = useStyles();
  function handleClick() {
    const { onClick, closeDrawer } = props;
    if (onClick) {
      onClick();
    }
    if (closeDrawer) {
      closeDrawer();
    }
  }

  const { pathname = '', subMenuItems, item } = props;

  let { id, label, icon } = item;
  if (!label) label = id;
  if (!icon) icon = id;

  const to = '/' + id + '/';

  const selected = to === '/' ? to === pathname : pathname.includes(props.to);

  return (
    <React.Fragment>
      <Hover
        style={{ width: '100%' }}
        render={hover => (
          <Link to={to ? to : ''} onClick={handleClick}>
            <div className={classes.container}>
              <div className={hover ? classes.rowHover : classes.row}>
                {/* <div className={classes.icon}>
                  <Icon
                    size={20}
                    icon={icons(label, false)} //selected || hover
                    inverted
                    color={selected ? 'primary' : hover ? 'font' : '#BEBEBE'}
                  />
                </div> */}

                <Text
                  align="center"
                  bold
                  myColor={selected ? 'primaryContrast' : 'primaryContrast'}
                  id={label}
                />
              </div>
            </div>
          </Link>
        )}
      />
      {subMenuItems && subMenuItems.length && (
        <SubMenu open={selected}>
          {subMenuItems.map((item, index) => (
            <SubMenuItem key={index} pathname={pathname} {...item} />
          ))}
        </SubMenu>
      )}
    </React.Fragment>
  );
};

export default MenuItemFocus;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    padding: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
  },
  rowHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
    border: `2px solid ${theme.palette.primary.main}`,
    width: '100%',
    padding: theme.spacing(1),
    borderRadius: 20,
  },
}));
