import * as _inputs from 'config/inputs';
import * as _customInputs from './inputs';
import * as Yup from 'yup';
import { checkBusinessGroup } from 'util/business';
import { sum } from 'util/general';
import {
  completedRequiredFields,
  intersectTierRequirements,
  mapFieldsToInputs,
} from '../utils';

const formConfig = props => {
  const {
    variant = 'onboarding',
    business = {},
    defaults = {},
    documents,
    bankAccounts,
    settingsConfig = {},
    salesCurrencies = [],
    productServiceSettings,
    businessCategories,
    user,
    tiers,
    sellers,
    setSellers,
    onboardingConfig,
    businessConfig,
  } = props;

  const userGroup = user?.groups?.[0]?.name ?? 'user';
  const isProductGroup = checkBusinessGroup(productServiceSettings, userGroup);

  const { colors } = defaults;
  const currencies = salesCurrencies
    ?.filter(x => !(businessConfig?.hideCurrency ?? []).includes(x))
    .map(item => ({
      value: item,
      label: item,
    }));

  const { bank = {}, legal = {}, locales } = settingsConfig;
  const { hideFields: hideBankFields = [] } = bank;
  const { hideFields: hideLegalFields = [] } = legal;

  let bankFields = [
    'currencies',
    'account_name_for_business',
    'account_number',
    'type',
    'bank_name',
    'bank_code',
    'branch_address',
    'branch_code',
    // 'bic',
    'swift',
    'iban',
    'routing_number',
  ];

  function validateDestinations(values = {}) {
    const { destinations = [] } = values;

    const total = sum(destinations, 'percentage');
    let valid = true;
    destinations.forEach(function (item) {
      const { account, bank_account, bitcoin_account } = item;
      if (!(account || bank_account || bitcoin_account)) {
        valid = false;
      }
    });

    return (
      (total === 100 && valid) || (destinations?.length === 0 && total === 0)
    );
  }

  bankFields = bankFields
    .filter(item => hideBankFields.indexOf(item) === -1)
    .map(item => _inputs[item]);

  let legalFields = [
    {
      id: 'inc_number',
      component: _customInputs.business_inc_number,
    },
    {
      id: 'vat_number',
      component: _inputs.vat_number,
    },
  ]
    ?.filter(x => !hideLegalFields.includes(x.id))
    ?.map(x => x.component);

  const sections = [
    {
      id: 'business_information',
      title: 'business_information_menu_title',
      heading: 'business_information_title',
      description: 'business_information_subtitle',
      icon: 'Store',
      image: 'merchant',
      completed: completedRequiredFields(business, ['id', 'name']),
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      fields: [
        _customInputs.business_registered_name,
        _customInputs.business_website,
        business?.id
          ? {
              type: 'output',
              value: business?.currency?.display_code,
              label: 'invoice_currency',
              disabled: true,
              horizontal: true,
              align: 'right',
              labelColor: 'font',
            }
          : { ..._inputs.business_currency, options: currencies },
      ],
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Required'),
      }),
    },
    {
      id: 'business_categories',
      title: 'business_categories',
      icon: 'tag',
      image: 'merchant',
      completed: !!business?.categories?.length,
      get hidden() {
        return (
          onboardingConfig?.business_onboarding?.hideSections?.includes(this.id) ||
          !businessCategories?.count
        );
      },
      disabled: Boolean(!business?.id),
      validationSchema: Yup.object().shape({
        categories: Yup.array(),
      }),
      fields: [
        {
          id: 'categories',
          type: 'business_categories',
        },
      ],
    },
    {
      id: 'business_seller_features',
      title: 'business_seller_features_menu_title',
      heading: 'business_seller_features_title',
      description: 'business_seller_features_subtitle',
      icon: 'shopping_bag',
      image: 'product',
      completed: !!sellers?.length,
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      validationSchema: Yup.object().shape({}),
      fields: [
        isProductGroup
          ? {
              id: 'seller',
              variant: 'group',
              fields: [
                business?.id
                  ? _customInputs.enable_seller(sellers, setSellers)
                  : _customInputs.add_seller,
              ],
            }
          : null,
      ],
    },
    {
      id: 'business_location',
      title: 'business_location_title',
      heading: 'business_location_title',
      description: 'business_location_subtitle',
      icon: 'Room',
      image: 'address',
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      mappedFields: intersectTierRequirements({
        section: 'business_location',
        tiers,
      }),
      get completed() {
        return completedRequiredFields(business, this.mappedFields, {
          type: 'business',
        });
      },
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields });
      },
      validationSchema: Yup.object().shape({}),
    },
    {
      id: 'business_legal',
      title: 'business_legal_title',
      heading: 'business_legal_title',
      description: 'business_legal_subtitle',
      icon: 'Gavel',
      image: 'legal',
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      completed: completedRequiredFields(business, [
        'vat_number',
        'inc_number',
      ]),
      fields: legalFields,
      validationSchema: Yup.object().shape({}),
    },
    {
      id: 'business_incorporation_documents',
      title: 'business_incorporation_documents_title',
      heading: 'business_incorporation_documents_title',
      description: 'business_incorporation_documents_subtitle',
      icon: 'Description',
      hideSaveButton: true,
      completed: Boolean(
        documents.find(
          x =>
            x.type === 'incorporation_certificate' ||
            x.metadata?.type === 'incorporation_certificate',
        ),
      ),
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          (variant === 'business_settings' &&
            !!businessConfig?.documents?.hide) ||
          onboardingConfig?.business_onboarding?.hideSections?.includes(this.id)
        );
      },
      disabled: Boolean(!business?.id),
      image: 'documents',
      get fields() {
        return [
          _customInputs.document_upload({
            name: this.id,
            docType: 'incorporation_certificate',
          }),
        ];
      },
    },
    {
      id: 'business_tax_certificate',
      title: 'business_tax_certificate_title',
      heading: 'business_tax_certificate_title',
      description: 'business_tax_certificate_subtitle',
      icon: 'request_quote',
      hideSaveButton: true,
      completed: Boolean(
        documents.find(
          x =>
            x.type === 'tax_certificate' ||
            x.metadata?.type === 'tax_certificate',
        ),
      ),
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          (variant === 'business_settings' &&
            !!businessConfig?.documents?.hide) ||
          onboardingConfig?.business_onboarding?.hideSections?.includes(this.id)
        );
      },
      disabled: Boolean(!business?.id),
      image: 'financialStatement',
      get fields() {
        return [
          _customInputs.document_upload({
            name: this.id,
            docType: 'tax_certificate',
          }),
        ];
      },
    },
    {
      id: 'business_finances',
      title: 'business_finances_title',
      heading: 'business_finances_title',
      description: 'business_finances_subtitle',
      icon: 'article',
      hideSaveButton: true,
      completed: Boolean(documents.find(x => x.type === 'financial_statement')),
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          (variant === 'business_settings' &&
            !!businessConfig?.documents?.hide) ||
          onboardingConfig?.business_onboarding?.hideSections?.includes(this.id)
        );
      },
      disabled: Boolean(!business?.id),
      image: 'financialStatement',
      get fields() {
        return [
          _customInputs.document_upload({
            name: this.id,
            docType: 'financial_statement',
          }),
        ];
      },
    },
    {
      id: 'business_trade_certificate',
      title: 'business_trade_certificate_title',
      heading: 'business_seller_features_title',
      description: 'business_trade_certificate_subtitle',
      icon: 'StoreFront',
      hideSaveButton: true,
      completed: Boolean(
        documents.find(
          x =>
            x.type === 'trade_certificate' ||
            x.metadata?.type === 'trade_certificate',
        ),
      ),
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          (variant === 'business_settings' &&
            !!businessConfig?.documents?.hide) ||
          onboardingConfig?.business_onboarding?.hideSections?.includes(this.id)
        );
      },
      disabled: Boolean(!business?.id),
      image: 'tradeCertificate',
      get fields() {
        return [
          _customInputs.document_upload({
            name: this.id,
            docType: 'trade_certificate',
          }),
        ];
      },
    },
    {
      id: 'business_shareholder_information',
      title: 'business_shareholder_information_title',
      heading: 'business_shareholder_information_title',
      description: 'business_shareholder_information_subtitle',
      icon: 'people',
      completed: Boolean(
        documents.find(x => x.type === 'shareholder_identification'),
      ),
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      image: 'basic_info',
      validationSchema: Yup.object().shape({}),
      get fields() {
        return [_customInputs.shareholders];
      },
    },
    {
      id: 'business_banking',
      title: 'business_banking_title',
      heading: 'business_banking_title',
      description: 'business_banking_subtitle',
      icon: 'AccountBalance',
      completed: completedRequiredFields(bankAccounts, [
        'bank_name',
        'name',
        'branch_code',
        'swift',
        'iban',
      ]),
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      image: 'bank',
      validationSchema: Yup.object().shape({}),
      fields: bankFields,
    },
    {
      id: 'business_branding',
      title: 'business_branding_title',
      heading: 'business_branding_title',
      description: 'business_branding_subtitle',
      completed: completedRequiredFields(business, ['logo', 'icon']),
      icon: 'BrandingWatermark',
      image: 'branding',
      get hidden() {
        return onboardingConfig?.business_onboarding?.hideSections?.includes(this.id);
      },
      disabled: Boolean(!business?.id),
      fields: [
        _customInputs.icon_upload([business?.logo, business?.icon]),
        _customInputs.colors(
          business && business.colors
            ? [business.colors.primary, business.colors.secondary]
            : [colors.primary, colors.secondary],
        ),
        // _customInputs.secondary_colors(
        //   business && business.colors
        //     ? [business.colors.secondary, business.colors.secondary_contrast]
        //     : [colors.secondary, colors.secondaryContrast],
        // ),
      ],
      validationSchema: Yup.object().shape({}),
    },
    {
      id: 'business_payouts',
      title: 'business_payouts_title',
      heading: 'business_payouts_title',
      description: 'business_payouts_subtitle',
      icon: 'PieChart',
      image: 'portfolio',
      validation: validateDestinations,
      fields: [_customInputs.payout_destinations],
      hidden: variant !== 'business_settings',
      disabled: Boolean(!business?.id),
    },
    {
      id: 'businesses',
      title: 'businesses',
      icon: 'merchant',
      get hidden() {
        return variant === 'onboarding';
      },
      disabled: Boolean(!business?.id),
      config: { noPadding: true },
      image: 'merchant',
      fields: [{ name: 'businesses', type: 'businesses' }],
    },
  ].filter(x => x.fields?.length && !x.hidden);

  const completedSections = sections.filter(x => Boolean(x.completed))?.length;
  const isOnboardingComplete = Boolean(
    sections?.length > 0 && sections?.length === completedSections,
  );

  return {
    locales,
    sections,
    completedSections,
    isOnboardingComplete,
  };
};

export default formConfig;
