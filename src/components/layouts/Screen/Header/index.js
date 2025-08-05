import React from 'react';

import { useSelector } from 'react-redux';
import { authUserSelector } from 'redux/auth/selectors';
import { get } from 'lodash';
import CategoriesHeader from './CategoryHeader';
import Management from './Management';
import TabHeader from './TabHeader';

export default function Header(props) {
  const { variant, pageVariant, ...restProps } = props;

  const user = useSelector(authUserSelector);

  const userGroup = get(user, ['groups', 0, 'name'], 'user');
  const isBusiness = userGroup.match(/merchant|admin|business/);
  if (pageVariant === 'categories') {
    return <CategoriesHeader {...restProps} />;
  }
  // if (variant === 'management') {
  //   return <Management {...restProps} />;
  // }
  return <TabHeader {...restProps} />;
}
