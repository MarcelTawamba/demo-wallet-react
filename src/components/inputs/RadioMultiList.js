import React, { useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import ToggleIcon from 'material-ui-toggle-icon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import RadioSelector from './RadioSelector';
import Text from 'components/outputs/Text';
import { Button } from './Button';

const addTo = (toAdd, items) => {
  let temp = [...items, toAdd];
  return temp;
};

const removeFrom = (toRemove, items) => {
  return items.filter(item => item !== toRemove);
};

const isOpen = ({ checked, open, value }) =>
  checked || Boolean(open.findIndex(item => item === value.id) !== -1);

const childCheck = ({ value, values, items }) => {
  const childItem = items.find(x => x.id === values?.[0]);

  return (
    childItem?.parent?.id === value?.id ||
    childItem?.parent?.parent?.id === value?.id
  );
};

export default function RadioMultiList(props) {
  const { items, values, parent, setOpen, setValue } = props;
  const classes = useStyles();

  const parentCategories = useMemo(
    () =>
      items
        ?.filter(item => item.parent === null)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );
  const isSingleParent = parentCategories?.length === 1;
  useEffect(() => {
    if (isSingleParent) {
      setOpen([parentCategories?.[0]?.id]);
    }
  }, [isSingleParent, setOpen, parentCategories]);

  if (parentCategories?.length === items?.length)
    return (
      <RadioSelector
        handleChange={event => setValue([event.target.value])}
        value={values?.[0]}
        items={items}
        responsive
      />
    );

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
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className={classes.container}>
      {filteredItems.map(item => (
        <RadioMultiListItem
          key={get(item, ['value', 'id'])}
          {...item}
          {...props}
          hideIcon={isSingleParent}
        />
      ))}
    </div>
  );
}

const RadioMultiListItem = props => {
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

  const children = items
    ?.filter(x => x.parent?.id === value?.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleSelect(event) {
    setValue([children?.find(x => x.id === event.target.value)?.id]);
  }

  return (
    <div
      className={
        Boolean(parent) || variant !== 'sections'
          ? classes.parent
          : classes.container2
      }
      key={value.id}>
      <div className={classes.row}>
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
          <RadioSelector
            handleChange={handleSelect}
            value={
              items?.find(x => x.parent && values.includes(x.id))?.id ?? {}
            }
            items={children}
            responsive
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
    hideIcon,
  } = props;
  const classes = useStyles();
  const { id } = value;

  const showOpen =
    openable &&
    items.findIndex(item => get(item, ['parent', 'id']) === id) !== -1;

  if (!showOpen) return null;

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
        disabled={disabled || hideIcon}>
        <div className={!parent ? classes.label : ''}>
          {!parent && (
            <Text
              style={{ width: '100%', fontSize: 15 }}
              bold
              myColor={isOpen ? 'primary' : 'font'}>
              {label}
            </Text>
          )}
          {!hideIcon && (
            <ToggleIcon
              on={isOpen}
              offIcon={<KeyboardArrowDownIcon className={classes.icon} />}
              onIcon={<KeyboardArrowUpIcon className={classes.icon} />}
            />
          )}
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
  },
  icon: {
    padding: 4,
  },
  parent: {
    paddingLeft: theme.spacing(1),
  },
  child: {
    paddingLeft: theme.spacing(1),
  },
}));
