import React, { useState } from 'react';

import Drawer from 'components/layout/Drawer';
// import Toast from 'components/outputs/Toast';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Menu from 'components/menu/Menu';
import MenuItem from 'components/menu/MenuItem';

import config from './src';
import Documentation from 'components/documentation/Documentation';

export default function DocumentationContainer(props) {
  const drawerHook = useState(false);
  const [drawerOpen, setDrawerOpen] = drawerHook;
  const location = window.location;
  const { pathname } = location;
  // const paths = pathname.split('/');
  // const page = paths.length > 3 ? paths[2] : '';
  // const section = paths.length > 4 ? paths[3] : '';

  // const currentPage = page ? config?.children?.[page] : config;
  // const currentSection = section ? currentPage?.children?.[section] : null;
  // const currentContent = currentSection ?? currentPage;

  const menuItems = Object.keys(config.children);

  const menuProps = { pathname, closeDrawer: () => setDrawerOpen(false) };

  return (
    <Drawer
      pathname={pathname}
      drawerHook={drawerHook}
      menu={
        <ErrorBoundary>
          <Menu
            style={{
              backgroundColor: '#F4F4f4',
              paddingTop: 32,
              paddingBottom: 4,
              width: '100%',
              flex: 1,
            }}>
            <MenuItem
              to="/documentation/"
              item={{ id: '', label: 'Introduction' }}
              {...menuProps}
            />
            {menuItems.map(item => (
              <MenuItem
                base="/documentation"
                key={item}
                item={{
                  id: item,
                  children: Object.keys(
                    config?.children?.[item]?.children ?? [],
                  ).map(item => {
                    return { id: item };
                  }),
                }}
                {...menuProps}
              />
            ))}
          </Menu>
        </ErrorBoundary>
      }>
      <ErrorBoundary>
        <Documentation config={config} />
      </ErrorBoundary>
    </Drawer>
  );
}
