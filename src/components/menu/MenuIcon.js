import React from 'react';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import MobileWalletIcon from '@material-ui/icons/SaveAltOutlined';
import './menu.css';
import context from '../common/context';

const _MenuIcon = props => {
  let { name, size, selected, colors, color } = props;

  if (!color) {
    color = colors[selected ? 'primary' : 'font'];
  }

  switch (name) {
    case 'Home':
      return renderHome(size, color);
    case 'Accounts':
      return renderWallet(size, color);
    case 'Rewards':
      return renderReward(size, color);
    case 'Products':
      return renderProduct(size, color);
    case 'Settings':
      return renderSetting(size, color);
    case 'Profile':
      return renderProfile(size, color);
    case 'Log out':
      return renderLogout(size, color);
    case 'Get mobile wallet':
      return renderMobileWallet(size, color);
    default:
      return null;
  }
};

const MenuIcon = context(_MenuIcon);

export default MenuIcon;

const renderHome = (size, color) => {
  return (
    <div className="svg">
      <svg
        data-name="Group 1194"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28">
        <g data-name="Symbol 2 1">
          <path
            data-name="Path 1719"
            d="M27.27 9.08L15 .33a1.74 1.74 0 0 0-2 0L.73 9.08a1.75 1.75 0 0 0 2 2.84l.73-.52v14.85A1.75 1.75 0 0 0 5.25 28h17.5a1.75 1.75 0 0 0 1.75-1.75V11.4a3 3 0 0 0 1.75.85 1.76 1.76 0 0 0 1-3.18zM21 24.5h-3.5v-5.25a3.5 3.5 0 0 0-7 0v5.25H7V8.9l7-5 7 5z"
            fill={color}
          />
        </g>
      </svg>
    </div>
  );
};

const renderWallet = (size, color) => {
  return (
    <div className="svg">
      <svg
        id="Group_1194"
        data-name="Group 1194"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28">
        <defs />
        <path
          id="Path_1793"
          data-name="Path 1793"
          className="cls-1"
          d="M24.22 0H3.92A4.06 4.06 0 0 0 0 4.17V24a3.93 3.93 0 0 0 3.85 4h20.37A3.81 3.81 0 0 0 28 24.15v-20A4 4 0 0 0 24.26 0zM13.38 17.24a5.33 5.33 0 0 0 5.14 5.53h7V24a1.26 1.26 0 0 1-1.23 1.28H3.92a1.15 1.15 0 0 1-1.1-1.21.17.17 0 0 0 0-.07V8.15a4 4 0 0 0 1.09.13h20.3a1.33 1.33 0 0 1 1.23 1.36v2.08H18.5a5.32 5.32 0 0 0-5.12 5.52zm12.07-2.8v5.28H18.5a2.65 2.65 0 0 1 0-5.28zM10.84 2.73h13.38a1.4 1.4 0 0 1 1.23 1.43V5.7a3.92 3.92 0 0 0-1.23-.16H3.92a1.36 1.36 0 0 1-1.2-1.4 1.35 1.35 0 0 1 1.2-1.4h6.92z"
          fill={color}
        />
        <path
          id="Path_1794"
          data-name="Path 1794"
          className="cls-1"
          d="M17 17.08a2.51 2.51 0 1 0 2.51-2.51A2.51 2.51 0 0 0 17 17.08z"
          fill={color}
        />
      </svg>
    </div>
  );
};

const renderReward = (size, color) => {
  return (
    <div className="svg">
      <svg
        id="Group_1194"
        data-name="Group 1194"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28">
        <defs />
        <path
          id="Path_1791"
          data-name="Path 1791"
          className="cls-1"
          d="M3.13 28c-1.25 0-1.8-.45-1.8-1.51V14.78A1.3 1.3 0 0 1 0 13.52a1.34 1.34 0 0 1 0-.2V7.88C0 7 .61 6.52 1.66 6.5H3a3.72 3.72 0 0 1 .49-4.95A5.71 5.71 0 0 1 7.42 0a6.14 6.14 0 0 1 2.72.64A5.88 5.88 0 0 1 11.77 2 17.38 17.38 0 0 1 14 5.28a19.6 19.6 0 0 1 2.21-3.35A5.4 5.4 0 0 1 20.53 0a1.94 1.94 0 0 1 .34 0c2.39.1 4.5 1.74 4.8 3.71a3.67 3.67 0 0 1-.67 2.8h1.22C27.4 6.51 28 7 28 8v5.37a1.31 1.31 0 0 1-1.15 1.44h-.11v11.68c0 1.05-.57 1.51-1.84 1.51zm20.47-2.45V14.8h-5.12v10.75zm-8.08 0V14.8h-3.14v10.75zm-6.1 0V14.8H4.3v10.75zm15.5-13.2V9h-6.44v3.4zm-9.4 0V9h-3.14v3.4zm-6.1 0V9H3v3.4zm-2-9.9a2.51 2.51 0 0 0-1.17.3 1.71 1.71 0 0 0-1.06 1.7 2 2 0 0 0 1.65 1.67 22.37 22.37 0 0 0 3.66.26h.8A14.42 14.42 0 0 0 8.93 3a1 1 0 0 0-.37-.24 2.79 2.79 0 0 0-1.13-.26zm9.38 3.84h2.54a7.93 7.93 0 0 0 1.07-.11l.69-.08a2 2 0 0 0 1.29-.73 1.66 1.66 0 0 0 .23-1.61 2.05 2.05 0 0 0-1.68-1.22l-.58-.06a1.8 1.8 0 0 0-1.46.62c-.6.73-1.14 1.55-1.67 2.32l-.31.45a4 4 0 0 0-.27.44z"
          fill={color}
        />
        <path
          id="Path_1792"
          data-name="Path 1792"
          className="cls-1"
          d="M3.28 27c-.8 0-1-.15-1-.81v-11.9c0-.06-.08-.12-.16-.13h-.26c-.73 0-.88-.19-.88-.78V8.51a3.54 3.54 0 0 1 0-.46c0-.49.24-.68.85-.68h2.52a.18.18 0 0 0 .15-.07.1.1 0 0 0 0-.13l-.06-.09-.13-.15a3.06 3.06 0 0 1-.38-4.32 2.91 2.91 0 0 1 .3-.31A4.69 4.69 0 0 1 7.51 1a5.1 5.1 0 0 1 2.26.53 4.86 4.86 0 0 1 1.38 1.14 17 17 0 0 1 2.43 3.77l.18.31c0 .06.08.07.12.1a.11.11 0 0 0 .08 0h.05a.17.17 0 0 0 .1-.07l.47-.78a18.75 18.75 0 0 1 2.24-3.41A4.42 4.42 0 0 1 20.42 1h.3a4.07 4.07 0 0 1 4 3 3.09 3.09 0 0 1-1.07 2.88l-.11.12a.11.11 0 0 0-.05.12c0 .08.06.13.16.13H26c.7 0 .93.19.93.74v5.24c0 .61-.17.75-.88.79h-.18-.07a.12.12 0 0 0-.11.13v12.03c0 .66-.21.81-1 .81zm21-12.74c0-.08-.07-.13-.16-.13h-6.36c-.1 0-.16.05-.16.13v11.53a.14.14 0 0 0 .16.14h6.34a.14.14 0 0 0 .16-.14zm-14 0c0-.08-.06-.13-.16-.13H3.79c-.1 0-.17.05-.17.13v11.53a.15.15 0 0 0 .17.14h6.33a.14.14 0 0 0 .16-.14zm6 0c0-.08-.07-.13-.17-.13h-4.36c-.1 0-.16.05-.16.13v11.53a.14.14 0 0 0 .16.14h4.38a.15.15 0 0 0 .17-.14zm0-5.7c0-.08-.07-.13-.17-.13h-4.36c-.1 0-.16.05-.16.13v4.38c0 .08.06.13.16.13h4.38c.1 0 .17-.05.17-.13zm9.26 0c0-.08-.07-.13-.16-.13h-7.62c-.1 0-.16.05-.16.13v4.38c0 .08.06.13.16.13h7.64c.1 0 .16-.05.16-.13zm-15.28 0c0-.08-.06-.13-.16-.13H2.49c-.1 0-.17.05-.17.13v4.38c0 .08.07.13.17.13h7.63c.1 0 .16-.05.16-.13zM7.52 2.08A3.4 3.4 0 0 0 6 2.46a2.31 2.31 0 0 0-1.48 2.23A2.63 2.63 0 0 0 6.78 7a23.65 23.65 0 0 0 3.77.26h1.77a.15.15 0 0 0 .13-.07.12.12 0 0 0 0-.13c-.11-.18-.21-.38-.32-.57a15.38 15.38 0 0 0-2.53-3.7 2.47 2.47 0 0 0-.6-.4 3.73 3.73 0 0 0-1.48-.31zm12.76 0a2.56 2.56 0 0 0-2.11.92c-.62.74-1.16 1.54-1.68 2.3l-.29.45a7.28 7.28 0 0 0-.47.82c-.07.13-.13.26-.21.4a.12.12 0 0 0 0 .13.19.19 0 0 0 .13.07h3.66A11.57 11.57 0 0 0 20.49 7l.65-.08a2.7 2.7 0 0 0 1.85-1 2.06 2.06 0 0 0 .29-2.13A2.8 2.8 0 0 0 21 2.12c-.25-.02-.49-.04-.72-.04z"
          fill={color}
        />
      </svg>
    </div>
  );
};

const renderProduct = (size = 24, color) => {
  return (
    <ShoppingCartOutlinedIcon
      style={{ paddingLeft: 2, paddingTop: 4, color, fontSize: size + 4 }}
    />
  );
};


const renderLogout = (size = 24, color) => {
  return <LogoutIcon style={{ color, size }} />;
};

const renderMobileWallet = (size = 24, color) => {
  return <MobileWalletIcon style={{ color, size }} />;
};

const renderProfile = (size, color) => {
  return (
    <div className="svg">
      <svg
        data-name="Group 1194"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28">
        <path
          d="M2.11 26.63v-3c0-3.33 5.35-6.06 11.89-6.06s11.89 2.73 11.89 6.06v3zm6-19.19a5.94 5.94 0 1 1 11.88 0 5.94 5.94 0 1 1-11.88 0z"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="3"
          // fill={color}
        />
      </svg>
    </div>
  );
};

const renderSetting = (size, color) => {
  return (
    <div className="svg">
      <svg
        data-name="Group 1194"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28">
        <path
          data-name="Path 108"
          d="M23.55 8.57l1.25-2.39a1.15 1.15 0 0 0-.2-1.36l-1.25-1.24A1.17 1.17 0 0 0 22 3.37l-2.39 1.25a1.15 1.15 0 0 1-1 0 6.38 6.38 0 0 0-.92-.34 1.11 1.11 0 0 1-.69-.69L16 .8a1.17 1.17 0 0 0-1.09-.8h-1.83A1.15 1.15 0 0 0 12 .78l-1 2.69a1.22 1.22 0 0 1-.76.73 5.87 5.87 0 0 0-.65.26 1.23 1.23 0 0 1-1.06 0L6.18 3.2a1.15 1.15 0 0 0-1.36.2L3.4 4.82a1.15 1.15 0 0 0-.2 1.36l1.25 2.39a1.23 1.23 0 0 1 0 1.06 5.87 5.87 0 0 0-.26.65 1.22 1.22 0 0 1-.73.76L.78 12A1.15 1.15 0 0 0 0 13.08v1.84A1.15 1.15 0 0 0 .78 16l2.7.94a1.16 1.16 0 0 1 .7.67c.12.31.25.6.37.91a1.21 1.21 0 0 1 0 1L3.2 22a1.15 1.15 0 0 0 .2 1.36l1.25 1.24a1.15 1.15 0 0 0 1.35.2l2.38-1.24a1.08 1.08 0 0 1 1 0 6.08 6.08 0 0 0 .93.34 1.15 1.15 0 0 1 .75.72l.94 2.6a1.15 1.15 0 0 0 1.1.78h1.84a1.15 1.15 0 0 0 1.1-.78l.94-2.7a1.16 1.16 0 0 1 .67-.7l.91-.37a1.21 1.21 0 0 1 1 .05L22 24.8a1.15 1.15 0 0 0 1.36-.2l1.25-1.25A1.15 1.15 0 0 0 24.8 22l-1.24-2.38a1.08 1.08 0 0 1 0-1 6.08 6.08 0 0 0 .34-.93 1.15 1.15 0 0 1 .72-.75l2.6-.94a1.15 1.15 0 0 0 .78-1.1v-1.82a1.15 1.15 0 0 0-.78-1.1L24.53 11a1.22 1.22 0 0 1-.73-.76 5.87 5.87 0 0 0-.26-.65 1.23 1.23 0 0 1 .01-1.02zM14 19.25a5.15 5.15 0 0 1-5.25-5.06V14a5.15 5.15 0 0 1 5.06-5.25H14a5.15 5.15 0 0 1 5.25 5.06V14a5.15 5.15 0 0 1-5.06 5.25z"
          fill={color}
        />
      </svg>
    </div>
  );
};
