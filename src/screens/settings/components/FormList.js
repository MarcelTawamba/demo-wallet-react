import React from 'react';
import SettingsList from 'components/lists/SettingsList';
import Form from 'components/form';

export default function FormList(props) {
  const {
    pageConfig,
    indexLoading,
    index,
    stateId,
    handleStateChange,
    reduxData,
    item,
  } = props;

  const { services, components, redux } = pageConfig;
  const { label = () => '', value = () => '', multiline, emptyListMessage } =
    components?.list ?? {};

  const canDelete = Boolean(services?.deleteData);
  const canEdit = Boolean(services?.createData);
  const data = reduxData?.[redux];

  if (stateId === 'edit' || stateId === 'new') {
    const isAdd = Boolean(stateId.match(/add|new/));
    return (
      <Form
        noLayout
        {...props}
        item={isAdd ? null : item}
        values={isAdd ? null : item}
      />
    );
  }

  let actions = [];
  if (canDelete) {
    actions.push({
      id: 'delete',
      action: item => handleStateChange(item, 'delete', index),
    });
  }
  if (canEdit) {
    actions.push({
      id: 'edit',
      action: item => handleStateChange(item, 'edit'),
    });
  }

  return (
    <SettingsList
      {...props}
      data={data}
      identifier={value}
      multiline={multiline}
      label={label}
      type={redux}
      stateId={stateId}
      containerIndex={index}
      indexLoading={indexLoading}
      emptyListMessage={emptyListMessage}
      actions={actions}
      canAdd={canEdit}
    />
  );
}
