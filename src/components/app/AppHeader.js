import React from 'react';
import './AppHeader.css';
import { View } from 'components/layout/View';
import Logo from 'components/rehive/Logo';
import LanguageSwitcher from 'components/layout/LanguageSwitcher';

const AppHeader = ({
  user,
  logoutUser,
  company,
  showCompany,
  style,
  classes,
  pathname = '/',
}) => {
  return (
    <div style={{ width: '100%', background: 'white', borderBottom: '1px solid #eee', padding: '8px 0', zIndex: 100 }}>
      <View fD={'row'} w={'100%'} aI={'center'} jC={'space-between'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showCompany ? (
            <Logo type={'rehive-logo'} />
          ) : (
            <React.Fragment>
              {company && company.logo ? (
                <Logo image={company.logo} />
              ) : (
                <Logo type={'rehive-logo'} />
              )}
            </React.Fragment>
          )}
        </div>
        <LanguageSwitcher />
      </View>
    </div>
  );
};

export default AppHeader;
