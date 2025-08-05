import React from 'react';
import DataTable from '../Page/DataTable';
import { List } from '../Page/List';
import Settings from '../Page/Settings';

export default function Page(props) {
  const { contentVariant, ...restProps } = props;

  switch (contentVariant) {
    case 'table':
      return <DataTable {...restProps} />;
    case 'settings':
      return <Settings {...restProps} />;
    case 'grid':
    case 'list':
    default:
      return <List grid {...restProps} />;
  }
}
