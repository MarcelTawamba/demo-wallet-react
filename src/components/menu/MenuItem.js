import React from 'react';
import Text from 'components/outputs/Text';
import { Link } from 'react-router-dom';
import SubMenu from './SubMenu';
import SubMenuItem from './SubMenuItem';
import makeStyles from '@material-ui/styles/makeStyles';
import Hover from 'components/layout/Hover';
import Icon from 'components/rehive/Icon';
import { standardizeString, reservedPages } from 'util/general';
import MenuItemFocus from './MenuItemFocus';

export default function MenuItem(props) {
  const classes = useStyles(props);
  const {
    onClick,
    closeDrawer,
    pathname = '',
    item,
    base = '',
    variant,
    parsedUrl = {},
    simple,
    userGroup,
    isProductGroup,
    isAdminGroup,
    isBusinessGroup,
    ...restProps
  } = props;
  if (variant === 'extra') {
    return <MenuItemFocus {...props} />;
  }
  function handleClick() {
    if (onClick) {
      onClick();
    }
    if (closeDrawer) {
      closeDrawer();
    }
  }

  let { id, label, children, icon, showChildren } = item;
  if (!label) label = id;
  if (!icon) icon = id;

  const to = props.to ? props.to : base + '/' + (id ? id + '/' : '');

  const { screenId } = parsedUrl;

  let paths = pathname.split('/');
  const home =
    label?.toLowerCase() === 'home' && !reservedPages?.includes(paths[1]);
  const selected =
    (to === '/' || props.to ? to === pathname : screenId?.includes(id)) || home;

  return (
    <React.Fragment>
      <Hover
        style={{ width: '100%' }}
        render={hover => (
          <>
            <Link to={to ? to : ''} {...restProps} onClick={handleClick}>
              <div className={classes.container}>
                <div
                  className={
                    simple
                      ? hover
                        ? classes.simpleHover
                        : classes.simple
                      : selected
                      ? classes.rowSelected
                      : hover
                      ? classes.rowHover
                      : classes.row
                  }>
                  <div className={classes.icon}>
                    <Icon
                      size={20}
                      icon={icon ?? id} //+ (!selected ? '' : '-filled')}
                      inverted
                      color={
                        selected ? 'primary' : hover ? 'font' : '#BEBEBE'
                      }
                    />
                  </div>

                  <Text myColor={selected ? 'primary' : 'font'} id={label} />
                </div>
              </div>
            </Link>
            {children && (
              <SubMenu open={selected || showChildren || hover}>
                {children.map(
                  (item, index) =>
                    !Boolean(item.condition && !item.condition(props)) && (
                      <SubMenuItem
                        base={base}
                        parent={id}
                        index={index}
                        key={item.id}
                        item={item}
                        parsedUrl={parsedUrl}
                        pathname={pathname}
                      />
                    ),
                )}
              </SubMenu>
            )}
          </>
        )}
      />
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    // paddingRight: theme.spacing(1),
    // paddingLeft: ({ simple }) => theme.spacing(simple ? 1 : 2),
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    // backgroundColor: '#FFF',
    width: '100%',
    justifyContent: 'center',
    // borderRadius: 20,
  },
  rowSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#FFF',
    width: '100%',
    // justifyContent: 'center',
    borderRadius: 20,
  },
  rowHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#FAFAFA',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 20,
  },
  simple: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  simpleHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    width: '100%',
  },
  icon: {
    // layout: 'flex',

    // paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
}));

