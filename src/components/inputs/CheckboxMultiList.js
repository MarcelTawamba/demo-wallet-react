import React, { useState } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import ToggleIcon from 'material-ui-toggle-icon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Collapse from '@material-ui/core/Collapse';

import Checkbox from './Checkbox';
import Text from 'components/outputs/Text';
import { Button } from './Button';

const addTo = (toAdd, items) => {
  let temp = [...items, toAdd];
  return temp;
};

const removeFrom = (toRemove, items) => {
  return items.filter(item => item !== toRemove);
};

const removeFromID = (toRemove, items) => {
  return items.filter(item => item.id !== toRemove.id);
};

const isOpen = ({ checked, open, value }) =>
  checked || Boolean(open.findIndex(item => item === value.id) !== -1);

const childCheck = ({ value, values, items }) => {
  let tempOpen = false;
  for (const temp of values) {
    const parent = temp.parent;
    if (parent) {
      if (parent.id === value.id) {
        tempOpen = true;
      } else if (parent.parent) {
        const parent2 = items.find(item => item.id === parent.id);
        if (get(parent2, ['parent', 'id']) === value.id) {
          tempOpen = true;
        }
      }
    }
  }

  return tempOpen;
};

const CheckboxMultiList = props => {
  const { items, values, parent } = props;
  const classes = useStyles();

  const filteredItems = items
    .filter(
      item =>
        (!parent && !item.parent) || (item.parent && item.parent.id === parent),
    )
    .map(item => {
      return {
        label: item.name,
        value: item,
        checked:
          values?.findIndex(value => (value?.id ?? value) === item.id) !== -1,
      };
    });

  return (
    <div className={classes.container}>
      {filteredItems.map(item => (
        <CheckboxMultiListItem
          key={get(item, ['value', 'id'])}
          {...item}
          {...props}
        />
      ))}
    </div>
  );
};

const CheckboxMultiListItem = props => {
  const {
    items,
    values,
    value,
    label,
    checked,
    setValue,
    openable,
    open = [],
    setOpen,
    parent,
    variant,
  } = props;
  const classes = useStyles();

  const childChecked = childCheck({ value, values, items });
  const opened = childChecked || isOpen({ checked, value, open });

  return (
    <div
      className={
        Boolean(parent) || variant !== 'sections'
          ? classes.parent
          : classes.container2
      }
      key={value.id}>
      <div className={classes.row}>
        {Boolean(parent) || variant !== 'sections' ? (
          <Checkbox
            label={label}
            name={value}
            value={checked}
            style={{ padding: 0 }}
            setValue={value => {
              if (checked) {
                setValue(removeFromID(value, values));
              } else {
                setValue(addTo(value, values));
                setOpen(addTo(value.id, open));
              }
            }}
          />
        ) : null}
        {openable && (
          <OpenIcon
            isOpen={opened}
            value={value}
            open={open}
            disabled={checked || childChecked}
            setOpen={setOpen}
            {...props}
          />
        )}
      </div>
      <Collapse in={opened}>
        <div className={classes.child}>
          <CheckboxMultiList
            values={values}
            setValue={setValue}
            items={items}
            parent={value.id}
            openable={openable}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </Collapse>
    </div>
  );
};

const OpenIcon = props => {
  const {
    open,
    setOpen,
    value,
    items,
    isOpen,
    openable,
    disabled,
    parent,
    variant,
    setValue,
    label,
  } = props;
  const classes = useStyles();
  const { id } = value;

  const showOpen =
    openable &&
    items.findIndex(item => get(item, ['parent', 'id']) === id) !== -1;

  if (!showOpen) {
    return null;
  }

  function handleOpen() {
    setOpen(
      !parent && variant === 'sections'
        ? open?.length === 1 && open[0] === id
          ? []
          : [id]
        : isOpen
        ? removeFrom(id, open)
        : addTo(id, open),
    );
    setValue(
      !parent && variant === 'sections'
        ? open?.length === 1 && open[0] === id
          ? []
          : [id]
        : isOpen
        ? removeFrom(id, open)
        : addTo(id, open),
    );
  }

  return (
    <>
      <Button
        variant="link"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(handleOpen);
        }}
        style={{ width: !parent ? '100%' : 'auto' }}
        noHover
        disabled={disabled}>
        <div className={!parent ? classes.label : ''}>
          {!parent && (
            <Text
              style={{ width: '100%', fontSize: 15 }}
              bold
              myColor={isOpen ? 'primary' : 'font'}>
              {label}
            </Text>
          )}
          <ToggleIcon
            on={isOpen}
            offIcon={<KeyboardArrowDownIcon className={classes.icon} />}
            onIcon={<KeyboardArrowUpIcon className={classes.icon} />}
          />
        </div>
      </Button>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  container2: {
    width: '100%',
  },
  label: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: theme.spacing(0.5),
  },
  // label: {
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
  icon: {
    padding: 4,
    // margin: 4,
  },
  parent: {
    paddingLeft: theme.spacing(1),
  },
  child: {
    paddingLeft: theme.spacing(1),
  },
}));

export default CheckboxMultiList;
