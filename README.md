# Rehive React Wallet - White Label Solution

A comprehensive white-label wallet application built with React 18, Material-UI v4, and integrated with the Rehive platform. This wallet supports multi-tenant configurations, extensive customization options, and seamless integration with the Rehive ecosystem.

## 🏗️ Technology Stack

- **React 18** with Vite 6.3.4 (migrated from Create React App)
- **Material-UI v4** (not v5 - important for compatibility)
- **React Query v3** for server state management (NOT v4+ due to breaking changes)
- **React Hook Form v7.47.0** for new forms (NOT v8+ due to breaking changes)
- **React Router v5** for navigation
- **Redux** for legacy state management (being migrated to React Query + Context)
- **Node.js >=20.0.0** as the runtime requirement

## 🚀 Quick Start

### Prerequisites

- Node.js >=20.0.0
- npm >=10.0.0 or yarn
- Access to Rehive platform (for configuration)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd wallet-react
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```bash
# Required environment variables
VITE_REHIVE_API_URL=https://api.rehive.com
VITE_APP_EXTENSION_API_URL=https://app.services.rehive.com
VITE_COMPANY_ID=your-company-id
```

4. **Start development server**
```bash
yarn start
# or
yarn dev
```

The application will start on `http://localhost:5173` (Vite default port).

### Build for Production

```bash
yarn build
```

## 🎨 White Label Configuration

This wallet supports two types of deployments:

### 1. Grey Label (Default Rehive Branding)
- Domains: `app.rehive.com`, `qa.rehive.com`, `localhost`
- Uses default Rehive configuration
- Suitable for testing and development

### 2. White Label (Custom Company Branding)
- Custom domains pointing to your deployment
- Company-specific branding and configuration
- Fetched from Rehive's company configuration API

### Configuration Setup

The wallet uses two complementary configuration systems:

#### A. Company Configuration (ConfigurationContext)
Located in `src/components/contexts/ConfigurationContext.js`

**For white label deployment:**
1. Set the `company` field on line 13 to your company ID
2. Update line 63 from `const resp = await getCompanyByDomain(domain);` to `const resp = await getCompanyByID(defaultConfig.company);`

**Configuration object includes:**
```javascript
{
  company: 'your-company-id',
  apple_app_store_url: 'https://apps.apple.com/...',
  android_play_store_url: 'https://play.google.com/store/apps/...',
  url: 'https://your-domain.com/',
  privacy_policy_url: 'https://your-domain.com/privacy/',
  terms_and_conditions_url: 'https://your-domain.com/terms/'
}
```

#### B. App Extension Configuration
Fetched from `app.services.rehive.com` and provides extensive customization options.

**📱 For detailed app extension configuration guide, see [APP_CONFIG.md](./APP_CONFIG.md)**

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── form/           # Form components (FormActions, inputs, etc.)
│   ├── general/        # General purpose components
│   ├── app/            # App-level components (routing, menus)
│   └── contexts/       # React Context providers
├── screens/            # Main application pages/screens
│   ├── auth/           # Authentication screens
│   ├── accounts/       # Account management
│   ├── business/       # Business features
│   ├── developers/     # Developer tools
│   └── [section]/config/locales/  # Screen-specific translations
├── hooks/              # Custom React hooks
├── util/               # Utility functions
│   ├── rehive.js       # Rehive API utilities
│   ├── general.js      # General utilities
│   └── business.js     # Business utilities
├── redux/              # Legacy Redux state (being migrated)
├── contexts/           # React Context providers
└── config/
    └── locales/        # Common translations
```

## 🎯 Development Guidelines

### State Management Migration

- **AVOID**: New Redux code - the project is migrating away from Redux
- **PREFER**: React Query v3 + React Context for new features
- **EXISTING**: Redux code is being gradually migrated

### Form Libraries

- **NEW FORMS**: Use React Hook Form v7 with custom `*RHF` components
- **EXISTING FORMS**: Formik v2.4.5 (don't migrate unless requested)
- **RHF COMPONENTS**: Use `SelectorRHF`, `MultiSelectRHF`, `CheckboxRHF`, `MobileInputRHF`

### Path Aliases

Configured in `jsconfig.json`:
```javascript
{
  "components/*": "./src/components/*",
  "config/*": "./src/config/*",
  "contexts/*": "./src/contexts/*",
  "hooks/*": "./src/hooks/*",
  "redux/*": "./src/redux/*",
  "screens/*": "./src/screens/*",
  "util/*": "./src/util/*"
}
```

### Adding New Screens

When adding new screens, update these locations:

1. **util/general.js:651-693** - Add to `reservedPages` array
2. **contexts/BusinessContext.js:19-31** - Add to `businessScreens` if business-related
3. **components/app/PrivateRouter.js** - Add lazy import + `<Route>`
4. **components/app/AppMenu.js:47-175** - Add menu item
5. **screens/index.js:123-137** - Add to `states` object if needed

### Translation System

- **Structure**: Screen-specific translations in `/src/screens/[section]/config/locales/[section].en.json`
- **Common translations**: `/src/config/locales/common.en.json`
- **Usage**: Use `useI18Language` hook
- **Keys**: Use translation keys instead of hardcoded text

#### ⚠️ Critical Component Patterns (Common Pitfall)
**Components use translation IDs, NOT labels:**
- `PageTitle`: Use `titleId="key"` (NOT `title="text"`)
- `ButtonList` items: Use `id: "key"` (NOT `label: "text"`)  
- `RadioSelector`: Use `title="key"` with `items=[{label: "key"}]`
- `EmptyListMessage`: Use `id="key"`
- `IconButton`: Use `tooltip={getI18Translation('key')}` for dynamic tooltips
- **Dynamic text**: Import `useI18Language` and use `getI18Translation('key')`

### Styling

- Use Material-UI v4 `makeStyles` hook pattern
- Follow existing theme structure
- Maintain responsive design patterns

## 🔐 Access Control & Routing

### Route Guards
- **Bridge KYC/TOS**: Forces `/bridge-terms/` if not approved
- **Tier Redirect**: Sends unverified users to `/onboarding/`
- **Admin Bypass**: Admins skip tier requirements
- **Public Routes**: `/documentation/`, `/email/`, `/password/`, `/checkout/`, `/sep24/`

### PrivateRouter Logic
The main routing component evaluates redirects in this priority order:
1. **Bridge Service KYC/TOS** → `/bridge-terms/`
2. **Tier Verification** → `/onboarding/`
3. **Business Onboarding** → `/onboarding/`
4. **Additional Requirements** → `/onboarding/`

**Important**: Always check data loading states (`hasTierData`, `businessLoading`, `documentsLoading`, `addressesLoading`) before making routing decisions.

### Access Control Layers
1. **Tier Verification**: `userTier >= requiredTier`
2. **Role Checks**: `isAdmin()`, `isBusiness()` utilities
3. **Service Gates**: Business features require specific service combinations
4. **Manager Groups**: `checkBusinessGroup()` validates business access

## 🧪 Testing

### Playwright E2E Tests

```bash
# Run all tests
yarn playwright test

# Run with environment variables
yarn env-cmd -f .env yarn playwright test

# Run on specific browser
yarn playwright test --project=chromium

# Run specific test file
yarn playwright test example.spec.js

# Debug mode
yarn playwright test --debug

# Generate tests with Codegen
yarn playwright codegen
```

## 🌍 Internationalization

### Language Sync Script

Generate combined language files for web and mobile wallets:

```bash
yarn language-sync
```

Access generated JSON at: `http://localhost:3000/download-en-json/`

## 🔧 Environment Variables

```bash
# Required
VITE_REHIVE_API_URL=https://api.rehive.com
VITE_APP_EXTENSION_API_URL=https://app.services.rehive.com

# Optional
VITE_COMPANY_ID=your-company-id
VITE_SENTRY_DSN=your-sentry-dsn
VITE_AMPLITUDE_API_KEY=your-amplitude-key
```

## 🚨 Common Pitfalls to Avoid

- **React Query v4+**: Currently using v3 - upgrading would require significant migration work
- **React Hook Form v8+**: Currently using v7 - upgrading would require significant migration work  
- **Material-UI v5**: Currently using v4 - upgrading would require significant migration work
- Don't add new Redux code (use React Query + Context for new features)
- Don't hardcode company/domain-specific logic
- Don't break white-label functionality
- Don't forget to add new screens to `reservedPages` array
- Don't modify PrivateRouter without checking loading states
- Never commit secrets or API keys

## 📚 Additional Resources

- [Rehive Platform Documentation](https://docs.rehive.com/)
- [Material-UI v4 Documentation](https://v4.mui.com/)
- [React Query v3 Documentation](https://react-query-v3.tanstack.com/)
- [React Hook Form v7 Documentation](https://react-hook-form.com/v7/)

## 🤝 Contributing

1. Follow existing code patterns and conventions
2. Use the established form libraries for each section
3. Maintain white-label compatibility
4. Add translations for new UI text
5. Update relevant documentation
6. Test in both grey-label and white-label modes

## 📄 License

This project is proprietary software. All rights reserved.