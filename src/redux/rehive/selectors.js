import { createSelector } from 'reselect';
import { merge, get } from 'lodash';

import default_auth from 'config/config/defaults/auth.json';
import default_actions from 'config/config/defaults/actions.json';
import default_faqs from 'config/config/defaults/faqs.json';
import default_help from 'config/config/defaults/help.json';

import default_verification from 'config/config/defaults/verification.json';
import default_pin from 'config/config/defaults/pin.json';
import default_product from 'config/config/defaults/product.json';

import default_cards from 'config/config/defaults/cards.json';
import default_sliders from 'config/config/defaults/sliders.json';
import default_screens from 'config/config/defaults/screens.json';

import default_design from 'config/config/defaults/design.json';
import default_themes from 'config/config/defaults/themes.json';
import default_colors from 'config/config/defaults/colors.json';
import default_profile from 'config/config/defaults/profile.json';
import default_settings from 'config/config/defaults/settings.json';
import default_accounts from 'config/config/defaults/accounts.json';
import default_checkout from 'config/config/defaults/checkout.json';
import default_app from 'config/config/defaults/app.json';
import default_onboarding from 'config/config/defaults/onboarding.json';
import default_business from 'config/config/defaults/business.json';
import default_developers from 'config/config/defaults/developers.json';
import default_menu from 'config/config/defaults/menu.json';

import { currentCompanySelector } from 'redux/auth/selectors.js';

export const defaultConfig = {
  auth: default_auth,
  actions: default_actions,
  cards: default_cards,
  pin: default_pin,
  sliders: default_sliders,
  screens: default_screens,
  design: default_design,
  product: default_product,
  profile: default_profile,
  themes: default_themes,
  colors: default_colors,
  verification: default_verification,
  settings: default_settings,
  checkout: default_checkout,
  app: default_app,
  onboarding: default_onboarding,
  developers: default_developers,
  faqs: default_faqs,
};

function mergeConfig(config, key, def) {
  let temp = get(config, key, def);
  return merge({}, def, temp);
}

export const rehiveStateSelector = state => state.rehive;

/* State selectors */
export const companyConfigSelector = createSelector(
  currentCompanySelector,
  currentCompany => get(currentCompany, 'config', defaultConfig),
);

export const configAuthStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'auth', default_auth),
);

export const configActionsStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => {
    return get(companyConfig, 'actions', default_actions);
  },
);

export const configCardsStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'cards', default_cards),
);

export const configPinStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'pin', default_pin),
);
export const configCheckoutSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'checkout', default_checkout),
);
export const configBusinessSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'business', default_business),
);
export const configOnboardingSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'onboarding', default_onboarding),
);
export const configDevelopersSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'developers', default_developers),
);

export const configSettingsSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'settings', default_settings),
);

export const configProductStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'product', default_product),
);

export const configSlidersStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'sliders', default_sliders),
);

export const configProfileStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'profile', default_profile),
);

export const configMenuSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'menu', default_menu),
);

export const configAccountsStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'accounts', default_accounts),
);

export const configAppSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'app', default_app),
);

export const configScreensStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'screens', default_screens),
);

export const configThemesStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'themes', default_themes),
);

export const configCurrentThemeStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'currentTheme', 'default'),
);

export const defaultTheme = get(default_themes, 'default', {});

export const configThemeDefaultStateSelector = createSelector(
  configThemesStateSelector,
  configThemesState => get(configThemesState, 'default', defaultTheme),
);

export const configFAQsSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'faqs', default_faqs),
);

export const configHelpSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'help', default_help),
);

export const configColorsStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'colors', default_colors),
);

export const configDesignStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'design', default_design),
);

export const configVerificationStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'verification', default_verification),
);

/* Other selectors */
export const configAuthSelector = createSelector(
  [configAuthStateSelector],
  configAuthState => {
    return merge({}, default_auth, configAuthState);
  },
);
export const configAccountsSelector = createSelector(
  [configAccountsStateSelector],
  configAccountsState => {
    return merge({}, default_accounts, configAccountsState);
  },
);

export const configActionsSelector = createSelector(
  [configActionsStateSelector],
  configActionsState => {
    return merge({}, default_actions, configActionsState);
  },
);

export const configVerificationSelector = createSelector(
  [configVerificationStateSelector],
  configVerificationState => {
    return merge({}, default_verification, configVerificationState);
  },
);

export const configPinSelector = createSelector(
  [configPinStateSelector],
  configPinState => {
    return merge({}, default_pin, configPinState);
  },
);

export const configSlidesAuthSelector = createSelector(
  configSlidersStateSelector,
  configSliders => {
    return get(configSliders, 'auth', default_sliders.auth);
  },
);

export const configSlidesPreAuthSelector = createSelector(
  configSlidersStateSelector,
  configSliders => {
    return get(configSliders, 'preAuth', default_sliders.preAuth);
  },
);
export const configSlidesPostAuthSelector = createSelector(
  configSlidersStateSelector,
  configSliders => {
    return get(configSliders, 'postAuth', default_sliders.postAuth);
  },
);

export const configProductSelector = createSelector(
  configProductStateSelector,
  configProductState => merge({}, default_product, configProductState),
);

export const configScreensWelcomeSelector = createSelector(
  configScreensStateSelector,
  configScreensState => {
    return get(configScreensState, 'welcome', default_screens.welcome);
  },
);

export const configCardsHomeStateSelector = createSelector(
  [configCardsStateSelector],
  configCardsState => {
    return merge({}, default_cards, configCardsState);
  },
);

export const notificationsSelector = createSelector(
  [configCardsHomeStateSelector, rehiveStateSelector],
  (configCardsHomeState, rehiveState) => {
    return {
      general: {
        ...get(get(default_cards, 'home', {}), 'general', {}),
        ...configCardsHomeState.general,
      },
      custom: get(configCardsHomeState, 'custom', []),
      dismissed: get(rehiveState, 'dismissedCards', []),
    };
  },
);

export const configCurrentThemeSelector = createSelector(
  [
    configThemesStateSelector,
    configCurrentThemeStateSelector,
    configThemeDefaultStateSelector,
  ],
  (configThemesState, configCurrentThemeState, configThemeDefaultState) => {
    return merge(
      {},
      configThemeDefaultState,
      get(configThemesState, 'default', {}),
      get(configThemesState, configCurrentThemeState, {}),
    );
  },
);

function cleanConfigColors(colors) {
  const { primary, secondary, primaryContrast, secondaryContrast } = colors;
  return { primary, secondary, primaryContrast, secondaryContrast };
}

export const configColorsSelector = createSelector(
  [configCurrentThemeSelector, configColorsStateSelector],
  (currentTheme, configColorsState) => {
    const colors = {
      ...default_colors,
      ...cleanConfigColors(configColorsState),
    };

    const keys = Object.keys(colors);
    for (const key of keys) {
      if (colors[key]?.[0] === '#' && colors[key].length > 7) {
        colors[key] = colors[key].substr(0, 7);
      }
    }

    return {
      ...colors,
      header: selectColor('header', currentTheme, colors), // TODO: do a map with this?
      headerContrast: selectColor('headerContrast', currentTheme, colors),
      authScreen: selectColor('authScreen', currentTheme, colors),
      authScreenContrast: selectColor(
        'authScreenContrast',
        currentTheme,
        colors,
      ),

      surface: selectColor('surface', currentTheme, colors),
      surfaceInput: selectColor('surfaceInput', currentTheme, colors),
      surfaceCard: selectColor('surfaceCard', currentTheme, colors),
      surfaceRear: selectColor('surfaceRear', currentTheme, colors),
      tabNavigator: selectColor('tabNavigator', currentTheme, colors),
      tabNavigatorInactive: selectColor(
        'tabNavigatorInactive',
        currentTheme,
        colors,
      ),
      tabNavigatorActive: selectColor(
        'tabNavigatorActive',
        currentTheme,
        colors,
      ),
    };
  },
);

const selectColor = (component, theme, colors) => {
  let color = get(
    theme,
    component,
    get(
      get(default_themes, configCurrentThemeStateSelector, defaultTheme),
      component,
      'black',
    ),
  );

  if (colors[color]) {
    color = colors[color];
  }

  if (color[0] === '#' && color.length > 6) {
    color = color.substr(0, 7);
  }

  return color;
};

const designCompiler = (key, configDesignState) => {
  switch (key) {
    case 'buttons':
    case 'popUp':
    case 'cards':
      return {
        ...default_design.general,
        ...default_design[key],
        ...configDesignState[key],
      };
    case 'wallets':
    case 'rewards':
    case 'products':
    case 'notifications':
    case 'campaigns':
    case 'orders':
    case 'settings':
      return {
        ...default_design.general,
        ...default_design.cards,
        ...default_design[key],
        ...configDesignState[key],
      };
    default:
      return { ...default_design[key], ...configDesignState[key] };
  }
};

export const configDesignSelector = createSelector(
  [configDesignStateSelector],
  configDesignState => {
    let design = { ...default_design };

    Object.keys(design).map((key, index) => {
      return (design[key] = designCompiler(key, configDesignState));
    });

    return design;
  },
);

export const userAddressesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.addresses ? rehiveState.addresses : [],
      loading: rehiveState.addressesLoading
        ? rehiveState.addressesLoading
        : false,
      error: rehiveState.addressesError ? rehiveState.addressesError : '',
    };
  },
);

export const userEmailsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.emails ? rehiveState.emails : [],
      loading: rehiveState.emailsLoading ? rehiveState.emailsLoading : false,
      error: rehiveState.emailsError ? rehiveState.emailsError : '',
    };
  },
);

export const userMobilesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.mobiles ? rehiveState.mobiles : [],
      loading: rehiveState.mobilesLoading ? rehiveState.mobilesLoading : false,
      error: rehiveState.mobilesError ? rehiveState.mobilesError : '',
    };
  },
);

export const userBankAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.bankAccounts ? rehiveState.bankAccounts : [],
      loading: rehiveState.bankAccountsLoading
        ? rehiveState.bankAccountsLoading
        : false,
      error: rehiveState.bankAccountsError ? rehiveState.bankAccountsError : '',
    };
  },
);

export const userDocumentsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.documents ? rehiveState.documents : [],
      loading: rehiveState.documentsLoading
        ? rehiveState.documentsLoading
        : false,
      error: rehiveState.documentsError ? rehiveState.documentsError : '',
    };
  },
);

export const userProfileSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.profile ? rehiveState.profile : {},
      loading: rehiveState.profileLoading ? rehiveState.profileLoading : false,
      error: rehiveState.profileError ? rehiveState.profileError : '',
    };
  },
);

export const userReferralCodeSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      data: rehiveState?.referralCodes ?? [],
      loading: rehiveState?.referralCodesLoading ?? false,
      error: rehiveState?.referralCodesError ?? false,
    };
  },
);

export const bankAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.bankAccounts ? rehiveState.bankAccounts : [],
      loading: rehiveState.bankAccountsLoading
        ? rehiveState.bankAccountsLoading
        : false,
      error: rehiveState.bankAccountsError
        ? rehiveState.bankAccountsError
        : false,
    };
  },
);

export const devicesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.devices ? rehiveState.devices : [],
      loading: rehiveState.devicesLoading ? rehiveState.devicesLoading : false,
      error: rehiveState.devicesError ? rehiveState.devicesError : false,
    };
  },
);

export const cryptoAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.cryptoAccounts ? rehiveState.cryptoAccounts : [],
      loading: rehiveState.cryptoAccountsLoading
        ? rehiveState.cryptoAccountsLoading
        : false,
      error: rehiveState.cryptoAccountsError
        ? rehiveState.cryptoAccountsError
        : false,
    };
  },
);
