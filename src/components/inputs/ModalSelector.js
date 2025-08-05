import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { shiftToStart } from 'util/general';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ToggleIcon from 'material-ui-toggle-icon';
import { Card } from '@material-ui/core';
import { useRef } from 'react';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import Modal from 'components/layout/Modal';
import Hover from 'components/layout/Hover';

const ModalSelector = props => {
  let {
    data,
    value,
    renderItem,
    onValueChange,
    keyExtractor,
    title,
    changeText,
    loading,
    footerComp,
    noBorder,
    skeletonComp,
    disabled,
    style,
  } = props;
  const classes = useStyles(props);
  const [open, setOpen] = useState(false);
  const myInput = useRef();

  const FooterComp = footerComp ? footerComp : null;
  const SkeletonComp = skeletonComp ? skeletonComp : null;

  function handleClick() {
    setOpen(!open);
  }

  function handleClose() {
    setOpen(false);
  }
  if (value) {
    data = shiftToStart(data, 'id', value.id);
  }
  return (
    <div style={style}>
      {loading ? (
        SkeletonComp ? (
          SkeletonComp
        ) : (
          <Spinner />
        )
      ) : (
        <>
          <Card
            onClick={disabled ? null : handleClick}
            className={classes.card}
            elevation={0}
            ref={myInput}>
            {renderItem(value)}
            {disabled ? null : changeText ? (
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
                onIcon={<KeyboardArrowDownIcon />}
                offIcon={<KeyboardArrowUpIcon />}
              />
            )}
          </Card>
          <Modal
            maxWidth={400}
            id="long-menu"
            title={title}
            close
            open={Boolean(open)}
            onDismiss={handleClose}>
            <>
              <div className={classes.modal}>
                {data.map((item, index) => (
                  <Hover
                    key={
                      keyExtractor
                        ? keyExtractor(item)
                        : item.id
                        ? item.id
                        : item
                    }
                    render={hover => (
                      <div
                        className={
                          hover || index === 0
                            ? classes.itemHover
                            : classes.item
                        }
                        onClick={() => {
                          onValueChange(item);
                          setOpen(false);
                        }}>
                        {renderItem(item)}
                      </div>
                    )}
                  />
                ))}
              </div>
              {FooterComp}
            </>
          </Modal>
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  modal: {
    padding: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(1),
    paddingLeft: 0,
    cursor: props => (props.disabled ? 'auto' : 'pointer'),
    border: props => (props.noBorder ? '' : '1px solid #EFEFEF'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
  },
  description: {
    padding: theme.spacing(1),
  },
  item: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  itemHover: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
  },
}));

export default ModalSelector;
