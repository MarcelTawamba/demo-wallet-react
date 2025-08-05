import React, { useState } from 'react';
import SimplePageList from 'components/lists/SimplePageList';
import Form from 'components/form';
import Modal from 'components/layout/Modal';
import VerifyLayout from 'components/layout/VerifyLayout';
import DeleteLayout from 'components/layout/DeleteLayout';
import { resendVerification } from 'util/rehive';
import { useSelector, useDispatch } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function FormList(props) {
  const {
    pageConfig,
    indexLoading,
    index,
    formConfig,
    reduxData,
    refresh,
    item,
    context,
    history,
    screenId,
    itemId,
    pageId,
    stateId,
  } = props;

  const isAdd = Boolean(stateId.match(/add|new/));
  const isEdit = Boolean(stateId.match(/edit/));
  const isVerify = Boolean(stateId.match(/verify/));
  const isDelete = Boolean(stateId.match(/delete/));

  const { services, components = {}, redux, id = '', type = id } = pageConfig;
  const { list, form, detail } = components ?? {};
  const company = useSelector(currentCompanySelector);
  const {
    label = () => '',
    value = () => '',
    multiline,
    emptyListMessage,
    actions,
  } = list ?? {};
  const canAdd = Boolean(services?.createData);

  function handleStateChange(item, type) {
    if (type === 'verify') {
      resendVerification(type, value(item), company?.id);
    }
    let newPath =
      '/' +
      screenId +
      '/' +
      (item !== 'back' || stateId || itemId ? pageId + '/' : '');
    if (item?.id) {
      newPath = newPath + item?.id + '/';
    }
    newPath = newPath + (type ? type + '/' : '');
    history.push(newPath);
  }

  const [tempItem, setTempItem] = useState(null);

  function handleSuccess(item, id) {
    refresh();
    if (isAdd && components?.verify) {
      setTempItem(item);
      handleStateChange(item, 'verify');
    } else if (!type?.match(/profile|basic/)) {
      setTempItem(null);
      handleStateChange('back');
    }
  }

  let actionsList = buildActionList(actions, services, handleStateChange);

  const modalVisible =
    isAdd || ((item || tempItem) && (isEdit || isVerify || isDelete));
  const hideModal = () => handleStateChange('back');

  return (
    <>
      {list ? (
        <SimplePageList
          {...props}
          data={context}
          identifier={value}
          config={list}
          multiline={multiline}
          label={label}
          type={type}
          handleStateChange={handleStateChange}
          stateId={stateId}
          containerIndex={index}
          indexLoading={indexLoading}
          emptyListMessage={emptyListMessage}
          actions={actionsList}
          canAdd={canAdd}
          onSuccess={handleSuccess}
        />
      ) : (
        <Form
          noLayout
          {...props}
          onSuccess={handleSuccess}
          formConfig={{ ...formConfig, title: '' }}
          item={isAdd ? null : item}
          values={isAdd ? null : item}
          isAdd={isAdd}
        />
      )}
      <Modal
        close
        maxWidth={500}
        open={modalVisible}
        onDismiss={hideModal}
        title={type + '_' + stateId}
        titleCentered={isDelete}
        disableEnforceFocus>
        {isVerify ? (
          <VerifyLayout
            {...props}
            item={item ?? tempItem}
            type={type}
            onCancel={hideModal}
            onSuccess={handleSuccess}
            context={{ company }}
          />
        ) : isDelete ? (
          <DeleteLayout
            {...props}
            type={type}
            onCancel={hideModal}
            onSuccess={handleSuccess}
          />
        ) : (
          <Form
            onCancel={hideModal}
            isAdd={isAdd}
            noLayout
            {...props}
            onSuccess={handleSuccess}
            formConfig={{ ...formConfig, title: '' }}
            item={isAdd ? null : item}
            values={isAdd ? null : item}
          />
        )}
      </Modal>
    </>
  );
}

function buildActionList(actions, services, handleStateChange) {
  const canEdit = actions?.edit && Boolean(services?.createData);
  const canDelete = actions?.delete && Boolean(services?.deleteData);
  const canVerify = actions?.verify; //&& Boolean(services?.verifyItem);
  const canPrimary = actions?.primary; //&& Boolean(services?.primaryItem);

  let actionsList = [];

  if (canDelete)
    actionsList.push({
      id: 'delete',
      action: item => handleStateChange(item, 'delete'), //index
    });

  if (canEdit)
    actionsList.push({
      id: 'edit',
      action: item => handleStateChange(item, 'edit'),
    });

  if (canVerify)
    actionsList.push({
      id: 'verify',
      value: item => item?.verified,
      // disabled: item => item?.verified,
      action: item => handleStateChange(item, 'verify'),
    });

  if (canPrimary)
    actionsList.push({
      id: 'primary',
      value: item => item?.primary,
      disabled: true,
      // action: item => handleStateChange(item, 'edit'),
    });
  return actionsList;
}
