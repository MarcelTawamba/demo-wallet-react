# Company config

## Overview

The company config is a json object field on the Rehive App Service that is used to customise the Rehive wallets to a specific company's requirements. This covers styling, content and onboarding.

Each section of the json object is described below as well as the default values that are used if a value isn't specified
Types: (s) - string, (b) - boolean, (i) - integer

<!-- ## Sections:

1. Sections

- Authentication
- Accounts
- Settings
- Profile
- Product

2. Account actions

3. Content

- Auth sliders
- Home notifications -->

### Implementation

##### Inheritance

Each section inherits the default values provided by Rehive and only replaces the attributes specified in each client config.

##### Localisation

Each section has a `locales` field with different language files to override labels in the app. Currently not fully implemented across all sections yet. Currently only supporting `en`, so the structure of this would be

```json
{
  "locales": {
    "en": {
      "label_override": "Label override"
    }
  }
}
```

## Auth

![image](https://user-images.githubusercontent.com/35782774/51036249-368d3b00-15b5-11e9-950d-5aef0b386cfb.png)
Auth screen showing: a) landing page, b) login form, c) simple register form, d) full register form

This section configures the auth screen flows

- identifier: (s: 'email'/'mobile') tells the app which field the users are required to log in with
- email: (s: 'required'/'optional'/'') prompts the user to verify their email:
  - required: app is blocked by this screen until user has verified email
  - optional: it can be skipped, but the user will be prompted again on next login
  - default: screen is skipped
- first_name: (b) requires user to enter their first name on register
- last_name: (b) requires user to enter their last name on register
- username: (b) requires user to enter a username on register
- nationality: (b) requires user to select their country
- defaultNationality: (s) two digit country code for user's defaut nationality
- pin: (s: 'required'/'optional'/'') prompts the user to activate pin or biometrics (touchID/faceID) - see "pin" section. Similar behaviour to email above with 'required'/'optional'/''.
  ![image](https://user-images.githubusercontent.com/35782774/51035802-e366b880-15b3-11e9-9e07-c871d1ebf028.png)
- mfa: (s: 'required'/'optional'/'') prompts the user to activate two-factor authentication on their account. This will require them to use a token/sms OTP on their next login. Similar behaviour to email above with 'required'/'optional'/''
- tier: (i: 0) required user tier level
- group: (b: true) prompt user to choose their group as part of the registration flow
- confirm_password: (b: false) shows a confirm password input and requires the user to confirm their password
- disableRegister: (b: false) disabled the registration flow by hiding the actions and preventing navigation
- sessions: applicable for client apps, allows signing in to multiple sessions at one time

```json
"auth": {
  "identifier": "email",
  "email": "",
  "mobile": "",
  "first_name": false,
  "last_name": false,
  "username": false,
  "nationality": false,
  "defaultNationality": "",
  "group": true,
  "confirm_password": false,
  "pin": "",
  "mfa": "",
  "disableRegister": false,
  "tier": 0,
  "sessions": true
},
```

## Profile

Controls the appearance / features in profile section

- hideID: (b) hides the ID field in profile
- labelID: (b) Overrides the ID field label
- addressTypes: (s[]) List of available address types

```json
"profile" : {
  "hideID": false,
  "labelID": "",
  "addressTypes": ["permanent", "shipping", "billing"]
}
```

## Settings

Controls whether certain sections are hidden in settings (names are self-explanatory)

```json
"settings" : {
  "hideCryptoAccounts": false,
  "hideBankAccounts": false,
  "hidePrimaryCurrency": false,
  "hideNotifications": false,
  "hideSmsMfa": false
}
```

## Product

Controls the appearance / features in product section

- currencies: hardcode override to only show products for these currencies (array of codes)
- defaultCurrency: overrides using the user's primary currency as default cart currency
- sales: config for PoS related features
  - userGroups: array of user groups to show "New Sale" button
  - invoiceConfig: shows discount/tax on invoice form

```
"product" :
  "currencies": [],
  "defaultCurrency": "",
  "sales": {
    "userGroups": ["merchant", "admin"],
    "invoiceConfig": { "showDiscount": false, "showTax": false }
  }
}
```

### Accounts

Controls the appearance / features in accounts section

- layout: (s: 'accounts'/'') groups currencies by accounts with totals, defaults to listing all currencies
- actionVariant: (s: 'text'/'') whether to use icons (default) or text action buttons
- identifier: (s 'name'/'') wether to use the account reference or account name in the web wallet url

```
"accounts" : {
  "layout": "",
  "actionVariant": "",
  "identifier": "name"
}
```

## Actions

Each subtype/action can be shown/hidden and configured using this section

### Condition

This section is consistent over all actions and includes (NOTE: this is to be phased out for subtype switches):

- hide: (b) - hides action by default
- hideCurrency: (s[]) - array of currencies to hide the action for

```json
"condition": {
  "hide": false,
  "hideCurrency": [""]
}
```

### Config

Each section has a different config, blank if there is no config beyond the condition above

#### send

- recipient - an array of allowed recipient types (["email", "mobile", "crypto"]

#### receive

#### deposit

#### withdraw

- pairs - for exchange convert
- message - shown on success page
- confirmMessage - shown on the confirm page
- infoMessage - shown on the form page

```json
"config": {
  "pairs": [],
  "message": "",
  "confirmMessage": "",
  "infoMessage": ""
}
```

#### pay

- showTip: allows adding tip on pay flow
- showRating: allows rating tip on pay flow
- tipType: ('fixed'/'') tip can either by a fixed amount or a percentage
- tipValues: array of hot tip button values

```
"config": {
  "showTip": false,
  "showRating": false,
  "tipType": "",
  "tipValues": ["5", "10", "25"]
}
```

#### prepaid

This section requires individual config for each currency adding funds should be allowed from, this is done by creating a entry of that currency code. Each currency then has the following config:

- providers: (s[]: 'indacoin'/'bank'/'stripe_card') currently supported providers, currently indacoin has to be used independently.
- currency: (s) applicable for indacoin, deposit currency
- fixed: if present shows a list of fixed voucher amounts to deposit, otherwise shows a normal text input
  - default - default selected vouchers
  - options - voucher options (note: points/cashBack not yet implemented)

```
"config": {
  "INTT": {
    "providers": ["indacoin"],
    "currency": "EUR"
  },
  "USD": {
    "providers": ["stripe_card", "bank"],
    "currency": "USD",
    "fixed": {
      "default": "20",
      "options": {
        "10": {
          "amount": 1000,
          "points": 10,
          "cashBack": "1.00"
        },
        "20": {
          "amount": 2000,
          "points": 25
        },
      }
    }
  }
},
```

#### exchange

#### transfer

#### redeem_voucher

#### scan

not a separate entry, but tied to the condition of `send` and `pay`

## Content

### Notification cards

This section contains details of what cards to displayed at different locations in the app. For now there are only cards on the home screen, designated with the home object. This is a very basic implementation that still needs to be expanded.

- general
  - welcome: (b) shows a welcome card

Each card object has the following properties:
- id: (i) unique identifier of card
- title: (s) title to be displayed on card
- description: (s) description to be displayed on card
- image: (s) image to be displayed on card, above the title. Image file must be located in `/assets/icons` Note: this is not currently working - also needs to be improved to fetch the images from a web server instead of local storage.
- dismiss: (b) can the card be dismissed from the home screen

```

"cards": {
  "home": {
    "general": {
      "welcome": true,
      "verify": true
    },
    "custom": [
      {
        "id": 0,
        "title": "Card 1",
        "description": "This is your custom text for card 1",
        "image": "card1",
        "dismiss": true
      },
      {
        "id": 1,
        "title": "Card 2",
        "description": "This is your custom text for card 2",
        "image": "card2",
        "dismiss": false
      }
    ]
  }
},
```

### sliders

This section contains multiple arrays of slide objects that are displayed at different locations in the app. Currently available in the following locations:

- preAuth - in grey label it's after choosing the app ID, in white label it's after first start up
- auth - carousel on the landing page
- postAuth - after successful registration flow

Each slide object has the following properties

- id: (i) unique identifier of slide
- title: (s) title to be displayed on slide
- description: (s) description to be displayed on slide
- image: (s) image to be displayed on the slide. Image file must be located in `/assets/icons` Note: this is not currently working - also needs to be improved to fetch the images from a web server instead of local storage.

```
"sliders": {
  "preAuth": null,
  "auth": [
    {
      "id": 0,
      "title": "Slide 1",
      "description": "This is your custom text for slide 1",
      "image": "slider1"
    }
  ],
  "postAuth": null,
},
```

### Colors

The theming in the app is based on using four main colors, where each of these colors is applied to different parts of the app (headers / buttons / icons) and each has a "Contrast" color for any text / item that needs to be legible against the color.

- primary: dark brand color, used for most of the app (headers, drawers, main buttons)
- secondary: light brand color, used anywhere else color is needed and usually provides contrast to the primary color
- tertiary: lighter brand color, used sparingly
- focus: something bright/eye-catching that is used to relay important information to the user / draw attention
- other colors: this config also provides setting colors for text, error, warning, success, positive and negative styling when the default colors clash with the brand colors
  ![image](https://user-images.githubusercontent.com/35782774/51036329-718f6e80-15b5-11e9-8dad-b7cc6adcc1f5.png)
  Colors: a) default, b) custom

```
"colors": {
  "primary": "#5969F6",
  "secondary": "#A4A5F5",
  "tertiary": "#FBFB8B",
  "focus": "#FC4F96",

  "primaryContrast": "#f6f6f6",
  "secondaryContrast": "#303030",
  "tertiaryContrast": "#000000",
  "focusContrast": "#ffffff",

  "warning": "#FC8755",
  "error": "#f44336",
  "success": "#4CAF50",
  "positive": "#4CAF50",
  "negative": "#f44336"
},
```

# (NO LONGER APPLICABLE)

### (NOT APPLICABLE) Local authentication (pin/touchID)

This section tells the app which actions require local authentication

- appLoad: (b) when app starts and a valid token still exists / user was logged in
  ![image](https://user-images.githubusercontent.com/35782774/51035882-27f25400-15b4-11e9-928b-46049ce835b7.png)
- security: (b) when accessing any security settings (Note: not yet implemented)
- send: (b) when attempting to send
  ![image](https://user-images.githubusercontent.com/35782774/51035950-53753e80-15b4-11e9-98ac-fcaff3b1da48.png)
- withdraw: (b) when attempting to withdraw
- updateDetails: (b) when changing primary contact details (Note: not yet implemented)

```
"pin": {
  "appLoad": true,
  "security": false,
  "send": true,
  "withdraw": true,
  "updateDetails": false
},
```

### (NOT APPLICABLE) KYC

This section tells the app what additional KYC steps are required and therefore shown in the "Profile" screen. By default this screen shows the users Personal Details, Emails, Mobiles & Addresses.

- requireDocumentID: (b) requires user to upload a copy of their ID
- requireDocumentAddress: (b) requires user to upload a copy of a proof of address
- requireDocumentAdvID: (b) requires user to upload a selfie to confirm identify
  [IMG of Profile screen without and with below]

```
"verification": {
    "requireDocumentID": true,
    "requireDocumentAddress": true,
    "requireDocumentAdvID": true
  },
```

### (NOT APPLICABLE) Design

Customisations to look and feel of app. Each section customises a certain element in the app and inherits the default values of its parent element type according to this diagram
![image](https://user-images.githubusercontent.com/35782774/51175012-d9013300-18c1-11e9-97e9-2aab52542daf.png)

##### Lists that can be customised:

- Wallets
- Rewards
- Campaigns
- Products
- Settings (covers Personal Details, Emails, Mobiles, Addresses and Bank Accounts)
- Notifications (home screen) The range of each attribute is also mentioned

##### Layouts

There are few built in layouts provided by the Rehive app. These layouts can be applied to all cards in the app using the "cards" section, or individually using the respective sections (same object as the lists above)
![image](https://user-images.githubusercontent.com/35782774/51175739-cdaf0700-18c3-11e9-8d7f-0488d9d86ac5.png)
a) 'default', b) 'rightAction', c) 'material', d) mini

#### General

- cornerRadius: (i | 0-30) controls the corner radius on all cards
  ![image](https://user-images.githubusercontent.com/35782774/51036565-2c1f7100-15b6-11e9-9ec0-5632d3babf57.png)
  Card corner radius: a) 2, b) 5, c) 15

- elevation: (b) android shadow amount
- shadow: (i) ios shadow amount
  [IMG of ios shadow 0, 3, 8, android 0, 2, 5]
- layout: (s| "default", "material") general layout to be used by app elements

```
"general": {
  "shadow": 5,
  "cornerRadius": 3,
  "elevation": 2,
  "layout": "default"
},
```

#### App

- surface: (i | 0-30) app follows a surface design, floating headers etc
  ![image](https://user-images.githubusercontent.com/35782774/51036964-69383300-15b7-11e9-8717-d6d59f206a18.png)

- tabBarLabels: (b) navigation tab bar has screen labels
  ![image](https://user-images.githubusercontent.com/35782774/51037020-a43a6680-15b7-11e9-8106-b700b4a86a9a.png)

```
"app": {
  "surface": false,
  "tabBarLabels": false
},
```

#### Cards

- ... general
- actionButtonType: (s| "text", "contained") action button types used in card
- titleLayout: (b) layout for title used in cards
  [IMG of card layout types]

```
"cards": {
  ... general,
  "actionButtonType": "text",
  "titleLayout": "layout1"
},
```

#### Buttons

- ... general
- rounded: (b) are buttons rounded on the ends
- bold: (b) is button action text bolded
  ![image](https://user-images.githubusercontent.com/35782774/51037081-d8158c00-15b7-11e9-8acd-389e2945fc03.png)
  Buttons: a) rounded + bold, b) square + normal

```
"buttons": {
  ... general,
  "rounded": false,
  "bold": true
},
```

#### Lists

These sections contain attributes to customise card lists in app for these

- wallets
- rewards
- products
- campaigns
- notifications

where each object contains

- ... cards
- header: (s) what header text to display
- headerActionType: (s) what type of header actions
- showActions: (b) if quick actions are shown in list

```
"buttons": {
  ... cards,
  "header": "",
  "headerActionType": "",
  "showActions": true
},
```

#### Home

NOT YET IMPLEMENTED
The home section defines the layout / what information is presented to the client on the home screen

- header: (s) what header component to display
- content: (s) what content lists to display, options are: notifications, wallets, rewards, quickSend

```
"home": {
  ... cards,
  "header": "wallets",
  "content": ["notifications", "quickSend", "rewards"]
},
```

### screens

Planned implementation similar to the sliders.
