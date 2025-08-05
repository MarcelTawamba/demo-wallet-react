# App Extension Configuration Guide

The Rehive wallet's app extension configuration system allows you to customize virtually every aspect of the wallet experience. This configuration is fetched from `app.services.rehive.com` and provides extensive control over features, UI elements, and user workflows.

## Overview

The app extension configuration is organized into multiple categories, each controlling different aspects of the application. This system works alongside the [ConfigurationContext](./src/components/contexts/ConfigurationContext.js) to provide a complete customization solution.

## Configuration API Endpoints

The wallet uses **two separate configuration systems**:

### 1. App Extension Configuration
- **Company Config**: `https://app.services.rehive.com/public/company/?company_id={id}`
- **User Config**: `https://app.services.rehive.com/user/`
- **Controls**: Auth, menu, design, business features, cards, product features, etc.
- **Redux Access**: Available via selectors like `configAuthSelector`, `configCardsStateSelector`, etc.
- **Source**: App extension API merged with local defaults

### 2. Subtype-Based Action Control (Current System)
- **Account Currency Subtypes**: `/accounts/{reference}/currencies/` or `/accounts/{reference}/currencies/{code}/`
- **Controls**: Action visibility based on enabled subtypes per account/currency
- **Filtering**: Subtypes filtered by company, user, group, tier, and account currency settings

## Core Configuration Categories

### 1. Actions Configuration (`actions`)

**⚠️ Note**: Actions are controlled by **subtypes** fetched from the Platform API, not app extension configuration.

Actions are shown/hidden based on **subtypes** enabled for each account currency. Subtypes are fetched from:
- `/accounts/{reference}/currencies/`
- `/accounts/{reference}/currencies/{code}/`

The `subtypes` property contains only subtypes allowed for that account currency, filtered by company, user, group, tier, and account currency settings.

#### Action-Subtype Mapping

```javascript
// Action visibility is determined by subtype availability
const actionSubtypes = {
  "buy": ["buy"],
  "sell": ["sell"], 
  "exchange": ["buy", "sell"],           // Hide if EITHER is disabled
  "send": [                              // Hide only if ALL are disabled
    "send_email",                        // Controls email recipient field
    "send_mobile",                       // Controls mobile recipient field  
    "send_account",                      // Controls account reference field
    "send_crypto"                        // Controls crypto address field
  ],
  "receive": [                           // Hide only if ALL are disabled
    "receive_email",
    "receive_mobile", 
    "receive_account"
  ],
  "deposit": ["deposit_manual"],
  "withdraw": ["withdraw_manual"],
  "transfer": [                          // Hide if EITHER is disabled
    "send_transfer",
    "receive_transfer"
  ]
};

// Special cases:
// - REQUEST: Controlled by PRS extension, not subtypes
// - SEND: Partial functionality based on subtype availability
// - EXCHANGE: Requires both buy AND sell subtypes
```

#### Legacy Configuration (Still Used)

Some actions still use the traditional configuration approach:

```javascript
{
  "send": {
    "condition": {
      "hideCurrency": ["BTC"],     // Legacy: Hide for specific currencies
      "hideAccounts": [],          // Legacy: Hide for specific accounts
      "showAccounts": []           // Legacy: Show only for specific accounts
    },
    "config": {
      "confirmMessage": "Custom confirmation message",
      "recipient": ["email", "mobile"]  // Allowed recipient types
    }
  },
  "deposit": {
    "condition": {
      "hideCurrency": ["USD"]
    },
    "config": {
      "hideDepositReference": false,
      "cryptoBankSupport": ["BTC", "ETH"]
    }
  }
}
```

### 2. Authentication Configuration (`auth`)

Customizes registration and login flows.

```javascript
{
  "identifier": "email",           // Primary identifier: email/mobile
  "email": "",                     // Default email
  "mobile": "",                    // Default mobile
  "terms": [],                     // Terms to accept
  "first_name": true,              // Require first name
  "last_name": true,               // Require last name
  "username": false,               // Require username
  "country": true,                 // Require country
  "nationality": false,            // Require nationality
  "residency": true,               // Require residency
  "business": true,                // Allow business registration
  "confirm_password": true,        // Require password confirmation
  "landing": "login",              // Default page: login/register
  "pin": "4",                      // PIN length requirement
  "mfa": "sms",                    // MFA method: sms/email/app
  "defaultNationality": "US",      // Default nationality
  "defaultResidency": "US",        // Default residency
  "disableRegister": false,        // Disable registration
  "tier": 1,                       // Default user tier
  "sessions": true                 // Enable session management
}
```

### 3. Menu Configuration (`menu`)

Controls which menu items are visible throughout the application.

```javascript
{
  "items": [
    {"name": "payments", "hide": false},
    {"name": "customers", "hide": true},
    {"name": "invoices", "hide": false},
    {"name": "cards", "hide": true},
    {"name": "developers", "hide": false},
    {"name": "business", "hide": true},
    {"name": "settings", "hide": false}
  ]
}
```

**Available Menu Items:**
- `payments` - Payment processing features
- `customers` - Customer management
- `invoices` - Invoice creation and management
- `cards` - Card management
- `developers` - API keys and developer tools
- `business` - Business account features
- `settings` - User settings and preferences

### 4. Accounts Configuration (`accounts`)

Customizes account display and behavior.

```javascript
{
  "layout": "list",                    // Display layout: list/grid
  "actionVariant": "contained",        // Button variant: contained/outlined/text
  "identifier": "name",               // Account identifier display: name/reference
  "amountDisplayCurrency": true,      // Show currency in amounts
  "displayAccountReference": false,   // Show account references
  "hideBalance": false,               // Hide account balances
  "hideInactive": true                // Hide inactive accounts
}
```

### 5. Design Configuration (`design`, `colors`, `themes`)

Customizes visual appearance and branding.

```javascript
{
  "colors": {
    "primary": "#1976d2",           // Primary brand color
    "secondary": "#dc004e",         // Secondary brand color
    "background": "#ffffff",        // Background color
    "surface": "#f5f5f5",          // Surface color
    "error": "#f44336",            // Error color
    "warning": "#ff9800",          // Warning color
    "info": "#2196f3",             // Info color
    "success": "#4caf50"           // Success color
  },
  "themes": {
    "dark": {
      "enabled": true,              // Enable dark theme
      "default": false              // Set as default theme
    }
  },
  "logo": {
    "url": "https://your-domain.com/logo.png",
    "width": 200,
    "height": 60,
    "alt": "Company Logo"
  },
  "favicon": {
    "url": "https://your-domain.com/favicon.ico"
  },
  "fonts": {
    "primary": "Roboto",           // Primary font family
    "secondary": "Arial"           // Secondary font family
  }
}
```

### 6. Business Configuration (`business`)

Controls business-specific features and workflows.

```javascript
{
  "invoices": {
    "enabled": true,
    "templates": ["basic", "detailed"],
    "autoSend": false,
    "requireApproval": true
  },
  "payouts": {
    "enabled": true,
    "requireApproval": true,
    "batchProcessing": false
  },
  "customers": {
    "enabled": true,
    "requireKYC": false,
    "autoVerify": false
  },
  "products": {
    "enabled": true,
    "categories": ["digital", "physical"],
    "inventory": true
  },
  "analytics": {
    "enabled": true,
    "realTime": false
  }
}
```

### 7. Checkout Configuration (`checkout`)

Customizes payment checkout experience.

```javascript
{
  "providers": ["stripe_card", "bank_transfer", "crypto"],
  "defaultProvider": "stripe_card",
  "currencies": ["USD", "EUR", "GBP", "BTC", "ETH"],
  "limits": {
    "min": "10.00",
    "max": "10000.00"
  },
  "fees": {
    "display": true,
    "includeInTotal": false
  },
  "confirmation": {
    "email": true,
    "sms": false
  },
  "fields": {
    "required": ["email", "name"],
    "optional": ["phone", "address"]
  }
}
```

### 8. Onboarding Configuration (`onboarding`)

Controls the user onboarding flow and requirements.

```javascript
{
  "steps": [
    {
      "name": "welcome",
      "required": true,
      "skip": false
    },
    {
      "name": "kyc",
      "required": true,
      "skip": false
    },
    {
      "name": "account_setup",
      "required": false,
      "skip": true
    }
  ],
  "verification": {
    "email": true,
    "mobile": true,
    "documents": ["passport", "license"]
  },
  "limits": {
    "unverified": "100.00",
    "basic": "1000.00",
    "advanced": "10000.00"
  }
}
```

### 9. Profile Configuration (`profile`)

Customizes user profile fields and requirements.

```javascript
{
  "fields": {
    "required": ["first_name", "last_name", "email"],
    "optional": ["mobile", "date_of_birth", "address"],
    "editable": ["first_name", "last_name", "mobile"],
    "hidden": ["ssn", "tax_id"]
  },
  "documents": {
    "types": ["passport", "license", "utility_bill"],
    "required": ["passport"],
    "formats": ["jpg", "png", "pdf"]
  },
  "privacy": {
    "showEmail": false,
    "showMobile": true,
    "showAddress": false
  }
}
```

### 10. Settings Configuration (`settings`)

Controls available user settings and preferences.

```javascript
{
  "sections": [
    {
      "name": "security",
      "enabled": true,
      "items": ["password", "2fa", "sessions"]
    },
    {
      "name": "notifications",
      "enabled": true,
      "items": ["email", "sms", "push"]
    },
    {
      "name": "preferences",
      "enabled": true,
      "items": ["language", "currency", "theme"]
    }
  ],
  "security": {
    "passwordRequirements": {
      "minLength": 8,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSymbols": false
    },
    "sessionTimeout": 3600,
    "maxSessions": 5
  }
}
```

### 11. FAQ Configuration (`faqs`)

Provides frequently asked questions content. Supports two formats: legacy (simple Q&A) and new (categorized).

#### Legacy Format

```javascript
{
  "description": "Find answers to common questions below",
  "questions": [
    {
      "en": {
        "question": "How do I reset my password?",
        "answer": "Click on 'Forgot Password' on the login page and follow the instructions."
      }
    },
    {
      "en": {
        "question": "What are the transaction limits?",
        "answer": "Transaction limits depend on your verification level. Basic users: $100/day, Verified users: $5000/day."
      }
    }
  ]
}
```

#### New Format (Categorized)

```javascript
{
  "description": "Browse our help topics below",
  "en": {
    "categories": [
      {
        "index": 1,
        "name": "Account & Security",
        "questions": [
          {
            "index": 1,
            "title": "How do I reset my password?",
            "answers": [
              {
                "title": "Via Email",
                "text": "Click 'Forgot Password' on the login page and enter your email address."
              },
              {
                "title": "Via Mobile",
                "text": "Select 'Reset via SMS' and enter your registered phone number."
              }
            ]
          },
          {
            "index": 2,
            "title": "How do I enable 2FA?",
            "answers": [
              {
                "title": "Setup Process",
                "text": "Go to Settings > Security > Two-Factor Authentication and follow the setup wizard."
              }
            ]
          }
        ]
      },
      {
        "index": 2,
        "name": "Payments & Transactions",
        "questions": [
          {
            "index": 1,
            "title": "What are the transaction fees?",
            "answers": [
              {
                "title": "Domestic Transfers",
                "text": "Free for transfers between wallet users. $2.50 for bank transfers."
              },
              {
                "title": "International Transfers",
                "text": "1.5% of transaction amount with a minimum of $5."
              }
            ]
          }
        ]
      }
    ]
  },
  // Additional language support
  "es": {
    "categories": [
      // Spanish translations
    ]
  }
}
```

**Key Features:**
- **Legacy Format**: Simple question/answer pairs with language support
- **New Format**: Hierarchical structure with categories and multiple answers per question
- **Multi-language**: Both formats support multiple languages
- **Sorting**: Categories and questions are sorted by `index` field
- **Description**: Optional description text shown above FAQ content

### 12. Help Configuration (`help`)

Provides configuration for help-related content and titles. Works alongside FAQ configuration.

```javascript
{
  "locales": {
    "en": {
      "faqs_title": "Frequently asked questions",
      "faqs_description": "Find answers to common questions",
      "support_title": "Contact Support",
      "support_description": "Get help from our support team",
      "about_title": "About Us",
      "about_description": "Learn more about our company"
    },
    "es": {
      "faqs_title": "Preguntas frecuentes",
      "faqs_description": "Encuentra respuestas a preguntas comunes",
      // Spanish translations...
    }
  }
}
```

### 13. PIN Configuration (`pin`)

Controls when PIN verification is required for different app actions.

```javascript
{
  "appLoad": true,           // Require PIN when app loads/resumes
  "security": false,         // Require PIN for security settings changes
  "send": true,              // Require PIN for send transactions
  "withdraw": true,          // Require PIN for withdrawals
  "updateDetails": false     // Require PIN for updating user details
}
```

### 14. Verification Configuration (`verification`)

Defines document verification requirements for user accounts.

```javascript
{
  "requireDocumentID": true,        // Require ID document (passport, license)
  "requireDocumentAddress": true,   // Require proof of address
  "requireDocumentAdvID": true      // Require advanced ID verification
}
```

### 15. Cards Configuration (`cards`)

Configures informational cards displayed on the home screen.

```javascript
{
  "home": {
    "general": {
      "welcome": true    // Show welcome card on home screen
    },
    "custom": [          // Custom cards to display
      {
        "id": "promo_card",
        "title": "Special Promotion",
        "description": "Get 10% cashback this month",
        "image": "https://example.com/promo.png",
        "action": "navigate",
        "target": "/promotions"
      }
    ]
  }
}
```

### 16. Sliders Configuration (`sliders`)

Controls onboarding and authentication slider content.

```javascript
{
  "auth": [],              // Sliders shown during authentication
  "preAuth": [             // Sliders shown before authentication (app selection)
    {
      "image": "https://example.com/slide1.png",
      "title": "Welcome to Your Wallet",
      "description": "Secure and easy payments"
    }
  ],
  "postAuth": [            // Sliders shown after successful registration
    {
      "image": "https://example.com/slide2.png", 
      "title": "You're All Set!",
      "description": "Start exploring your new wallet"
    }
  ]
}
```

### 17. Screens Configuration (`screens`)

Screen-specific configurations, currently supporting welcome screen customization.

```javascript
{
  "welcome": [             // Welcome screen content blocks
    {
      "type": "hero",
      "title": "Welcome to Your Digital Wallet",
      "subtitle": "Send, receive, and manage your money",
      "image": "https://example.com/hero.png"
    },
    {
      "type": "features",
      "items": [
        {
          "icon": "send",
          "title": "Send Money",
          "description": "Transfer funds instantly"
        },
        {
          "icon": "receive",
          "title": "Receive Payments",
          "description": "Accept payments from anyone"
        }
      ]
    }
  ]
}
```

### 18. Product Configuration (`product`)

Controls product and point-of-sale features for merchant functionality.

```javascript
{
  "layout": "grid",                     // Product display layout: grid/list
  "currencies": ["USD", "EUR"],         // Supported currencies for products
  "defaultCurrency": "USD",             // Default product currency
  "sales": {
    "userGroups": ["merchant", "admin"], // Groups allowed to make sales
    "invoiceConfig": {
      "showDiscount": false,            // Show discount field on invoices
      "showTax": false                  // Show tax field on invoices
    }
  },
  "topUpAccount": "teller",             // Account used for top-ups
  "voucher": {
    "userGroups": ["merchant", "admin"] // Groups allowed to create vouchers
  }
}
```

### 19. App Configuration (`app`)

General application-level configuration.

```javascript
{
  "menu": {
    "hide": ["rewards", "cards"]        // Menu items to hide globally
  }
}
```

### 20. Developers Configuration (`developers`)

Configuration for developer tools and documentation.

```javascript
{
  "docsUrl": "https://docs.rehive.com/merchants/get-started/introduction/",
  "apiUrl": "https://api.rehive.com",
  "sandboxUrl": "https://api.staging.rehive.com",
  "showTestMode": true,                 // Show test mode toggle
  "allowedEndpoints": [                 // Restrict API explorer endpoints
    "/auth/*",
    "/accounts/*",
    "/transactions/*"
  ]
}
```

## Using Configuration in Components

### React Query Hooks (Recommended for New Code)

```javascript
import { 
  useAppConfig,
  useActionsConfig,
  useMenuConfig,
  useAuthConfig,
  useActionPermission,
  useMenuItemVisibility 
} from 'hooks/useAppConfig';

function MyComponent({ currency, userGroup, accountId }) {
  // Get full app configuration
  const { data: appConfig, isLoading } = useAppConfig();
  
  // Get specific configuration sections
  const { data: actionsConfig } = useActionsConfig();
  const { data: authConfig } = useAuthConfig();
  
  // Check specific action permissions
  const { isAllowed: canDeposit } = useActionPermission(
    'deposit', 
    currency, 
    userGroup, 
    accountId
  );
  
  // Check menu visibility
  const { shouldHide: hidePayments } = useMenuItemVisibility('payments');
  
  if (isLoading) return <div>Loading configuration...</div>;
  
  return (
    <div>
      {!hidePayments && <PaymentsSection />}
      {canDeposit && <DepositButton />}
      {authConfig?.first_name && <FirstNameInput required />}
    </div>
  );
}
```

### Legacy Redux Usage (Existing Code)

```javascript
import { useSelector } from 'react-redux';
import { 
  configAuthSelector,
  configMenuSelector,
  configBusinessSelector,
  configFAQsSelector,
  configPinSelector,
  configVerificationSelector,
  configCardsStateSelector,
  configProductSelector,
  configAppSelector,
  configDevelopersSelector,
  configScreensStateSelector,
  configSlidersStateSelector 
} from 'redux/rehive/selectors';

function AppFeatures() {
  // Get configuration sections via Redux selectors
  const authConfig = useSelector(configAuthSelector);
  const menuConfig = useSelector(configMenuSelector);
  const businessConfig = useSelector(configBusinessSelector);
  const faqConfig = useSelector(configFAQsSelector);
  const pinConfig = useSelector(configPinSelector);
  const verificationConfig = useSelector(configVerificationSelector);
  const cardsConfig = useSelector(configCardsStateSelector);
  
  // Check menu visibility
  const hideCustomers = menuConfig.items?.find(item => item.name === 'customers')?.hide;
  const hideInvoices = menuConfig.items?.find(item => item.name === 'invoices')?.hide;
  
  // Check FAQ format
  const isLegacyFAQ = Boolean(faqConfig && !faqConfig.en);
  
  // Check PIN requirements
  const requirePinForSend = pinConfig?.send;
  
  // Check verification requirements
  const needsIDVerification = verificationConfig?.requireDocumentID;
  
  return (
    <div>
      {/* Show/hide features based on auth config */}
      {authConfig?.sessions && <SessionManager />}
      {authConfig?.business && <BusinessRegistration />}
      
      {/* Show/hide menu items based on menu config */}
      {!hideCustomers && <CustomersSection />}
      {!hideInvoices && businessConfig?.invoices?.enabled && <InvoicesSection />}
      
      {/* Conditional business features */}
      {businessConfig?.payouts?.enabled && (
        <PayoutsSection requireApproval={businessConfig.payouts.requireApproval} />
      )}
      
      {/* FAQ handling */}
      {isLegacyFAQ ? (
        <LegacyFAQList questions={faqConfig.questions} />
      ) : (
        <CategorizedFAQList categories={faqConfig?.en?.categories} />
      )}
    </div>
  );
}
```

### Advanced Usage with Conditions

#### React Query Approach (Recommended)

```javascript
import { 
  useAuthConfig,
  useMenuConfig,
  useBusinessConfig,
  useMenuItemVisibility 
} from 'hooks/useAppConfig';

function AppFeatures() {
  // Get specific configuration sections
  const { data: authConfig, isLoading: authLoading } = useAuthConfig();
  const { data: businessConfig, isLoading: businessLoading } = useBusinessConfig();
  
  // Check menu visibility with helper hook
  const { shouldHide: hideCustomers } = useMenuItemVisibility('customers');
  const { shouldHide: hideInvoices } = useMenuItemVisibility('invoices');
  
  if (authLoading || businessLoading) {
    return <div>Loading configuration...</div>;
  }
  
  return (
    <div>
      {/* Show/hide features based on auth config */}
      {authConfig?.sessions && <SessionManager />}
      {authConfig?.business && <BusinessRegistration />}
      
      {/* Show/hide menu items based on menu config */}
      {!hideCustomers && <CustomersSection />}
      {!hideInvoices && businessConfig?.invoices?.enabled && <InvoicesSection />}
      
      {/* Conditional business features */}
      {businessConfig?.payouts?.enabled && (
        <PayoutsSection requireApproval={businessConfig.payouts.requireApproval} />
      )}
    </div>
  );
}
```

#### Subtype-Based Approach (Current System)

```javascript
import { hideAction } from 'screens/accounts/util/actions';
import { useSelector } from 'react-redux';
import { configActionsStateSelector } from 'redux/rehive/selectors';

// Action-subtype mapping (customizable in codebase)
const actionSubtypes = {
  send: ['send_email', 'send_mobile', 'send_account', 'send_crypto'],
  receive: ['receive_email', 'receive_mobile', 'receive_account'],
  deposit: ['deposit_manual'],
  withdraw: ['withdraw_manual'],
  buy: ['buy'],
  sell: ['sell'],
  exchange: ['buy', 'sell'], // Hide if EITHER is disabled
  transfer: ['send_transfer', 'receive_transfer'], // Hide if EITHER is disabled
};

function WalletActions({ currency, profile, tier, account }) {
  const actionsConfig = useSelector(configActionsStateSelector);
  
  const isActionAllowed = (action) => {
    // Check legacy conditions first
    const legacyHidden = hideAction(action, {
      currency,
      profile,
      actionsConfig,
      tier,
    });
    
    if (legacyHidden) return false;
    
    // Check subtype availability
    const requiredSubtypes = actionSubtypes[action] || [];
    const availableSubtypes = currency.subtypes || [];
    
    if (requiredSubtypes.length === 0) return true;
    
    // Different logic per action
    switch (action) {
      case 'send':
      case 'receive':
        // Hide only if ALL subtypes are disabled
        return requiredSubtypes.some(subtype => 
          availableSubtypes.includes(subtype)
        );
      
      case 'exchange':
      case 'transfer':
        // Hide if ANY required subtype is disabled
        return requiredSubtypes.every(subtype => 
          availableSubtypes.includes(subtype)
        );
      
      default:
        // Single subtype actions
        return availableSubtypes.includes(requiredSubtypes[0]);
    }
  };
  
  return (
    <div>
      {isActionAllowed('send') && <SendButton currency={currency} />}
      {isActionAllowed('receive') && <ReceiveButton currency={currency} />}
      {isActionAllowed('deposit') && <DepositButton currency={currency} />}
    </div>
  );
}
```

## Configuration Validation

The configuration system includes built-in validation to ensure proper structure and values:

```javascript
// Example validation functions used internally
const validateActionsConfig = (config) => {
  const validActions = ['send', 'receive', 'deposit', 'withdraw', 'prepaid'];
  return Object.keys(config).every(action => validActions.includes(action));
};

const validateAuthConfig = (config) => {
  const validIdentifiers = ['email', 'mobile', 'username'];
  return validIdentifiers.includes(config.identifier);
};
```

## Configuration Hierarchy

Configuration values follow this hierarchy (highest to lowest priority):

1. **User-specific config** - Individual user overrides
2. **Company config** - Company-wide settings
3. **Default config** - Built-in fallback values

## Environment Variables

Configure the app extension service URL:

```bash
VITE_APP_EXTENSION_API_URL=https://app.services.rehive.com
```

## Common Configuration Patterns

### Hiding Features for Specific User Groups

```javascript
{
  "actions": {
    "withdraw": {
      "condition": {
        "hideGroups": ["basic", "unverified"]
      }
    }
  }
}
```

### Currency-Specific Restrictions

```javascript
{
  "actions": {
    "deposit": {
      "condition": {
        "hideCurrency": ["BTC"],
        "cryptoBankSupport": ["ETH", "LTC"]
      }
    }
  }
}
```

### Business Feature Toggles

```javascript
{
  "business": {
    "invoices": {
      "enabled": true,
      "requireApproval": false
    },
    "customers": {
      "enabled": false
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Configuration not loading**: Verify `VITE_APP_EXTENSION_API_URL` is set correctly
2. **Features not hiding/showing**: Check configuration hierarchy and selector usage
3. **Invalid configuration**: Ensure JSON structure matches expected format

### Debug Configuration

#### React Query Debugging

```javascript
// Debug current configuration in browser console
import { useQueryClient } from 'react-query';

function DebugConfig() {
  const queryClient = useQueryClient();
  
  // Get cached app config data
  const companyConfig = queryClient.getQueryData(['appConfig', 'company', companyId]);
  const userConfig = queryClient.getQueryData(['appConfig', 'user']);
  
  console.log('Company config:', companyConfig);
  console.log('User config:', userConfig);
  console.log('All cached queries:', queryClient.getQueryCache().getAll());
  
  return null;
}
```

#### Redux Debugging (Legacy)

```javascript
// Debug current configuration in browser console
import store from 'redux/store';
import { configStateSelector } from 'redux/rehive/selectors';

console.log('Current config:', configStateSelector(store.getState()));
```

## React Query Hooks Reference

The following hooks are available in `src/hooks/useAppConfig.js`:

### Core Hooks

- **`useAppConfig(companyId, enabled)`** - Get complete app configuration
- **`useCompanyAppConfig(companyId, enabled)`** - Get company-specific config only
- **`useUserAppConfig(enabled)`** - Get user-specific config only
- **`useCurrentCompanyAppConfig()`** - Get config for current company from Redux

### Section-Specific Hooks

- **`useActionsConfig(companyId)`** - Get actions configuration
- **`useAuthConfig(companyId)`** - Get authentication configuration
- **`useMenuConfig(companyId)`** - Get menu configuration
- **`useAccountsConfig(companyId)`** - Get accounts configuration
- **`useDesignConfig(companyId)`** - Get design/theming configuration
- **`useBusinessConfig(companyId)`** - Get business features configuration
- **`useCheckoutConfig(companyId)`** - Get checkout configuration
- **`useFAQsConfig(companyId)`** - Get FAQ configuration (if implemented)
- **`usePinConfig(companyId)`** - Get PIN configuration (if implemented)
- **`useVerificationConfig(companyId)`** - Get verification configuration (if implemented)
- **`useCardsConfig(companyId)`** - Get cards configuration (if implemented)
- **`useSlidersConfig(companyId)`** - Get sliders configuration (if implemented)
- **`useScreensConfig(companyId)`** - Get screens configuration (if implemented)
- **`useProductConfig(companyId)`** - Get product configuration (if implemented)
- **`useAppConfig(companyId)`** - Get app configuration (if implemented)
- **`useDevelopersConfig(companyId)`** - Get developers configuration (if implemented)

### Permission & Visibility Hooks

- **`useActionPermission(action, currency, userGroup, accountId)`** - Check if action is allowed
- **`useMenuItemVisibility(menuItemName)`** - Check if menu item should be hidden

### Hook Features

- **Automatic Caching**: 5-15 minute cache times depending on data volatility
- **Background Refetching**: Keeps data fresh
- **Error Handling**: Graceful fallbacks when configuration unavailable
- **Type Safety**: Proper data transformation and validation
- **Optimistic Updates**: Immediate UI updates with proper rollback

## Best Practices

1. **Use React Query hooks for new code** - Prefer the new hooks over Redux selectors
2. **Test configuration changes** in development before deploying to production
3. **Use feature flags** to gradually roll out new features
4. **Document custom configurations** for your specific implementation
5. **Validate configuration** on the backend before serving to clients
6. **Cache configuration** appropriately to reduce API calls
7. **Version your configurations** to track changes over time
8. **Use section-specific hooks** when you only need part of the configuration

## Related Files

- `src/components/contexts/ConfigurationContext.js` - Company/domain configuration
- `src/redux/rehive/selectors.js` - Configuration selectors
- `src/util/rehive.js` - API utilities for fetching configuration
- `CLAUDE.md` - Development guidelines and patterns