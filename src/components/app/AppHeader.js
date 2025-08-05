import React from 'react';
import './AppHeader.css';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Logo from '../../header/components/rehive/Logo';
// import Layout from 'components/base/Layout';
import MenuIcon from 'components/menu/MenuIcon';
import Header from 'components/layout/Header';
import HeaderButton from 'components/menu/HeaderButton';

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
    <Header>
      <View fD={'row'} w={'100%'} aI={'center'} jC={'center'}>
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
      </View>
      {/* <View w={'100%'} aI={'center'} jC={'flex-end'} fD={'row'}>
        {user && user.id ? (
          <View fD={'row'} w={'auto'} aI={'center'} jC={'flex-end'}>
            <HeaderButton
              label="Settings"
              to="/settings"
              pathname={pathname}
              subMenuItems={[{ label: 'Claimed', to: '/rewards/claimed' }]}
            />
            <HeaderButton
              label="Profile"
              to="/profile"
              pathname={pathname}
              subMenuItems={[{ label: 'Claimed', to: '/rewards/claimed' }]}
            />
            <Button
              // wide
              color={'primary'}
              variant={'text'}
              onClick={() => logoutUser()}>
              LOGOUT
            </Button>
          </View>
        )}
      </View> */}
      {/* </View> */}
    </Header>
  );
  // return (
  //   <Layout color="white" style={style} header>
  //     <React.Fragment>

  //     </React.Fragment>
  //   </Layout>
  // );
};

export default AppHeader;
