import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import Popover from '@material-ui/core/Popover';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ToggleIcon from 'material-ui-toggle-icon';
import { Card } from '@material-ui/core';
import { useRef } from 'react';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import ListItem from 'components/outputs/ListItem';

const DropdownSelector = props => {
  let {
    data,
    item,
    prefix = '',
    valueProps,
    renderItem = item => <Item {...props} item={item} />,
    onValueChange,
    keyExtractor,
    changeText,
    loading,
    popUp,
    listItem,
    transformOriginHorizontal = 'left',
    renderFooter = null,
    ...restProps
  } = props;
  const classes = useStyles(props);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const myInput = useRef();

  function handleClick(event) {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  }
  // data = shiftToStart(data, 'name', item.name);

  const temp = data.find(value => value.value === item);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <div {...restProps}>
        <Card
          onClick={handleClick}
          className={classes.card}
          elevation={0}
          ref={myInput}>
          <>
            {renderItem(temp ? temp : item)}
            {changeText ? (
              <Text
                color="primary"
                align="right"
                width="auto"
                style={{ fontWeight: '500' }}>
                {changeText}
              </Text>
            ) : (
              <ToggleIcon
                on={!open}
                className={classes.icon}
                onIcon={<KeyboardArrowDownIcon />}
                offIcon={<KeyboardArrowUpIcon />}
              />
            )}
          </>
        </Card>
      </div>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        // anchorReference={'anchorPosition'}
        open={Boolean(open && anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: transformOriginHorizontal,
        }}
        anchorPosition={{ left: -32, top: 50 }}
        onClose={handleClick}
        PaperProps={{
          style: {
            marginTop: 8,
            maxHeight: 300,
            maxWidth: popUp
              ? 200
              : myInput && myInput.current
              ? myInput.current.offsetWidth
              : 300,
            width: '100%',
          },
        }}>
        {data.map(item => (
          <div
            className={classes.item}
            key={keyExtractor ? keyExtractor(item) : item.id ? item.id : item}
            onClick={() => {
              onValueChange(item?.value ?? item);
              setOpen(false);
            }}>
            {listItem ? <ListItem title={item} /> : renderItem(item)}
          </div>
        ))}
        {renderFooter}
      </Popover>
    </>
  );
};

function Item(props) {
  const { item, data, prefix, valueProps } = props;

  const classes = useStyles(props);

  return (
    <Text
      className={classes.text}
      children={item?.label ?? prefix + item}
      width="auto"
      {...valueProps}
    />
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    // paddingBottom: theme.spacing(2),
  },
  card: {
    padding: props => (props.noCard || props.noPadding ? 0 : theme.spacing(1)),
    paddingLeft: 0,
    marginBottom: props =>
      props.mb ? props.mb : props.noCard ? 0 : theme.spacing(2),
    cursor: 'pointer',
    border: props =>
      props.noBorder || props.noCard ? '' : '1px solid #EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: props => (props.noCard ? 'auto' : '100%'),
    alignItems: 'center',
    // paddingRight: props => (props.noCard ? theme.spacing(1) : 0),
  },
  icon: {
    marginRight: props =>
      props.noCard || props.noPadding ? theme.spacing(1) : 0,
  },
  text: {
    // padding: theme.spacing(1),
    // paddingLeft: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%',
    alignItems: 'center',
    paddingRight: theme.spacing(0.5),
    paddingLeft: props => (props.noCard ? 0 : theme.spacing(0.5)),
  },
  description: {
    padding: theme.spacing(1),
  },
  item: {
    paddingTop: ({ noPadding }) => (noPadding ? 0 : theme.spacing(1)),
    paddingBottom: ({ noPadding }) => (noPadding ? 0 : theme.spacing(1)),
    paddingLeft: ({ paddedItem }) => (!paddedItem ? 0 : theme.spacing(1)),
    cursor: 'pointer',
  },
}));

export default DropdownSelector;
