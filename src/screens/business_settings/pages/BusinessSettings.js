import React, { useState, useEffect } from 'react';
import { useTheme } from 'components/app/context';
import { convertToFormData } from 'util/methods';
import { useHistory } from 'react-router-dom';
import {
  updateBusinessProfile,
  createBusinessProfile,
  getDocuments,
  updateItem,
  addBankAccountCurrency,
  createBusinessDocument,
  deleteBankAccountCurrency,
  getProductServiceSettings,
  getBusinessDocuments,
  updateBusinessCategories,
  deleteBusinessCategory,
  getBusinessCategories,
} from 'util/rehive';
import BusinessSettingsConfig from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { snakeString } from 'util/general';
import { omit, pick, difference, groupBy } from 'lodash';
import momentTz from 'moment-timezone';
import SettingsContainer from '../components/SettingsContainer';
import {
  userBankAccountsSelector,
  configSettingsSelector,
  userProfileSelector,
  configBusinessSelector,
} from 'redux/rehive/selectors';
import { fetchData } from 'redux/rehive/actions';
import { useToast } from 'components/contexts/ToastContext';
import { getSellers, createSeller } from 'screens/products_admin/util/rehive';
import { useQuery } from 'react-query';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useBusiness } from 'contexts';

export default function BusinessSettings(props) {
  const { colors } = useTheme();
  const accounts = useSelector(walletsSelector);
  const { primaryAccount, companyCurrencies, accountsDictionary } = accounts;
  const timezone = momentTz.tz.guess();

  let [currentSection, setCurrentSection] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(false);
  const { business, refetchBusinesses } = useBusiness();
  const company = useSelector(currentCompanySelector);
  const profile = useSelector(userProfileSelector);
  const [sellers, setSellers] = useState();
  const bankAccounts = useSelector(userBankAccountsSelector);
  const businessConfig = useSelector(configBusinessSelector);
  // const userDocuments = useSelector(userDocumentsSelector);
  const dispatch = useDispatch();
  const settingsConfig = useSelector(configSettingsSelector);
  const { showToast } = useToast();

  const queryProductServiceSettings = useQuery(
    ['productServiceSettings', company?.id],
    getProductServiceSettings,
  );

  useEffect(() => {
    async function handleFetch() {
      setLoading(true);
      if (business?.id) {
        await Promise.all([
          new Promise(resolve => {
            getDocuments().then(resp => {
              let tempDocs = resp?.results ?? [];

              getBusinessDocuments({ businessId: business?.id }).then(resp => {
                setDocuments(tempDocs.concat(resp?.data?.results ?? []));
                resolve();
              });
            });
          }),
          new Promise(resolve => {
            getSellers().then(resp => {
              setSellers(resp?.data?.results);
              resolve();
            });
          }),
        ]);
      }

      setLoading(false);
    }

    dispatch(fetchData('bankAccounts'));
    dispatch(fetchData('accounts'));
    dispatch(fetchData('cryptoAccounts'));

    if (business?.id) {
      handleFetch();
    } else {
      refetchBusinesses();
    }
  }, [business?.id]);

  useEffect(() => {
    setError(null);
  }, [currentSection]);

  const currency =
    business?.currency?.code ??
    (
      companyCurrencies.find(item => item.code === 'USD') ??
      companyCurrencies?.[0]
    )?.code;

  const { data: businessCategories, isLoading } = useQuery(
    [company?.id, 'business-categories'],
    getBusinessCategories,
    // { enabled: isBusinessGroup }
  );

  const { sections = [], locales } = BusinessSettingsConfig({
    variant: 'business_settings',
    business,
    documents: documents ?? [],
    bankAccounts: bankAccounts?.items ?? [],
    defaults: { colors, currency },
    settingsConfig,
    salesCurrencies: companyCurrencies?.map(x => x.code),
    productServiceSettings: queryProductServiceSettings?.data,
    user: profile?.items,
    businessCategories,
    sellers,
    setSellers,
    businessConfig,
  });

  const activeSection = sections?.[currentSection];

  async function handleSubmit(
    values,
    { setSubmitting, setFieldError, setFieldTouched },
  ) {
    let resp = null;

    switch (activeSection.id) {
      case 'business_information':
        const tempValues = {
          ...values,
          category:
            typeof values.category === 'string'
              ? values.category
              : values.category?.id,
        };
        resp = await updateBusiness(tempValues);
        break;
      case 'business_seller_features':
        resp = await addSeller(values);
        break;
      case 'business_banking':
        resp = await saveBankDetails(values);
        if (resp?.status === 'success') {
          dispatch(fetchData('bankAccounts'));
        }
        break;
      case 'business_branding':
        if (values.images) {
          let fields = [];
          if (values.images.logo?.type)
            fields.push({ key: 'logo', value: values.images.logo });
          if (values.images.icon?.type)
            fields.push({ key: 'icon', value: values.images.icon });
          resp = await updateBusiness(convertToFormData(fields), true);
        }

        if (!resp || resp?.status === 'success') {
          const mappedValues = mapStructure(values);
          resp = await updateBusiness(mappedValues);
        }

        if (!values?.images?.logo || !values?.images?.icon)
          resp = {
            status: 'error',
            message: 'Please upload both a logo and an icon',
          };
        break;
      case 'business_incorporation_documents':
      case 'business_tax_certificate':
      case 'business_finances':
      case 'business_trade_certificate':
        return setSubmitting(false);
      case 'business_location':
        const temp = mapStructure({ location: values });

        resp = await updateBusiness(temp);
        break;
      case 'business_categories':
        const oldCategories = business?.categories?.map(item => item.id) ?? [];
        const categories = values?.categories;
        const toRemoveCategories = difference(oldCategories, categories);
        for (let i = 0; i < toRemoveCategories.length; i++) {
          await deleteBusinessCategory(business?.id, toRemoveCategories[i]);
        }
        resp = await updateBusinessCategories(business?.id, {
          categories,
        });
        refetchBusinesses();
        break;
      default:
        const mappedValues = mapStructure(values);

        resp = await updateBusiness(mappedValues);
        break;
    }

    if (resp?.status === 'success') {
      showToast({ id: 'updated_' + activeSection?.id, variant: 'success' });
    } else {
      const errors = resp?.data;
      Object.keys(errors).forEach(key => {
        const error = errors?.[key]?.[0];
        setFieldError(key, error);
        setFieldTouched(key, true);
      });
      setError(resp?.message ?? 'Unable to update business profile');
    }
    setSubmitting(false);
  }

  async function updateBusiness(values, isFile = false) {
    let response;

    if (business?.id) {
      response = await updateBusinessProfile(business?.id, values, isFile);
    } else {
      const data = {
        currency: 'USD',
        ...values,
        id: snakeString(values?.name),
        account: accountsDictionary?.sales ?? primaryAccount,
        timezone,
      };

      delete data.add_seller;
      response = await createBusinessProfile(data);
    }
    if (response?.status === 'success') {
      refetchBusinesses();
    }

    // if (response.status === 'success') setBusiness(response.data);

    return response;
  }

  async function addSeller(data) {
    let response = { status: 'success', message: '', data: [] };

    try {
      if (!data?.add_seller) return response;
      await createSeller(data);
    } catch (error) {
      response = {
        status: 'error',
        message: error.message,
      };
    }
    return response;
  }

  async function uploadDocuments(docs) {
    let response = { status: 'success', message: '', data: [] };

    await Promise.all(
      docs.map(
        async doc =>
          new Promise(resolve => {
            createBusinessDocument({
              businessId: business?.id,
              file: doc.file,
              type: doc.type,
              metadata: {
                name: doc.name,
                ...doc.metadata,
              },
            })
              .then(resp => {
                response.data.push(resp?.data);
                resolve();
              })
              .catch(error => {
                response.status = 'error';
                response.message += error?.file
                  ? `\n${doc?.file?.name}: ${error?.file[0]}`
                  : error.non_field_errors[0];
                resolve();
              });
          }),
      ),
    );

    return response;
  }

  async function saveBankDetails(values) {
    let response = { status: 'success', message: '' };

    try {
      // Filter out read-only fields and only include editable fields
      const editableFields = {
        name: values.name,
        number: values.number,
        type: values.type,
        bank_name: values.bank_name,
        bank_code: values.bank_code,
        branch_code: values.branch_code,
        swift: values.swift,
        iban: values.iban,
        // Include routing_number if it exists in the form values
        ...(values.routing_number && { routing_number: values.routing_number }),
        id: values.id, // Keep the ID for updating
      };
      
      // Include owner if it exists
      if (values.owner) {
        editableFields.owner = values.owner;
      }
      
      // Include branch_address if it exists and is not a string
      if (values.branch_address && typeof values.branch_address !== 'string') {
        editableFields.branch_address = values.branch_address;
      }
      
      // Include any nested owner fields if they exist
      Object.keys(values).forEach(key => {
        if (key.startsWith('owner.') || key.startsWith('branch_address.')) {
          editableFields[key] = values[key];
        }
      });

      const resp = await updateItem('bankAccounts', editableFields);
      const { currencies: newCurrencies } = values;

      response.data = resp;
      const oldCurrencies = resp.currencies.map(item => item.code);
      const toAdd = difference(newCurrencies, oldCurrencies);
      let i = 0;
      for (i = 0; i < toAdd.length; i++) {
        await addBankAccountCurrency(resp.id, toAdd[i]);
      }
      const toRemove = difference(oldCurrencies, newCurrencies);
      for (i = 0; i < toRemove.length; i++) {
        await deleteBankAccountCurrency(resp.id, toRemove[i]);
      }

      // if (!values.id) await addBankAccountCurrency(resp.id, 'USD');
    } catch (error) {
      response.status = 'error';
      response.message = error.message;
    }

    return response;
  }

  function mapStructure(values) {
    const {
      primary_colors,
      secondary_colors,
      location,
      destinations,
      currency,
    } = values;

    if (primary_colors || secondary_colors)
      values.colors = { ...primary_colors, ...secondary_colors };

    if (location) {
      let mapped = {};
      for (const [key, value] of Object.entries(values.location)) {
        mapped[`address_${key}`] = value;
      }

      values = { ...values, ...mapped };
    }
    if (destinations)
      values.destinations = destinations.map(item => ({
        ...item,
        currency: item?.currency?.code ?? item?.currency ?? '',
      }));
    if (currency) values.business_currency = currency?.code ?? currency;

    return omit(values, [
      'primary_colors',
      'secondary_colors',
      'docuuments',
      'images',
      'location',
      !values.icon || typeof values.icon === 'string' ? 'icon' : '',
      !values.logo || typeof values.logo === 'string' ? 'logo' : '',
    ]);
  }

  function mapInitialValues(sectionId) {
    switch (sectionId) {
      case 'business_information':
        return {
          ...pick(business, ['name', 'category', 'website']),
          currency,
        };
      case 'business_banking':
        const tempItem = bankAccounts?.items?.[0] ?? {};
        const bank_acc_copy = {
          ...tempItem,
          currencies: (tempItem?.currencies ?? []).map(item => item.code),
          branch_address: [
            tempItem?.branch_address?.line_1,
            tempItem?.branch_address?.line_2,
            tempItem?.branch_address?.city,
            tempItem?.branch_address?.state_province,
            tempItem?.branch_address?.country,
            tempItem?.branch_address?.postal_code,
          ]
            .filter(x => x)
            .join(', '),
        };
        if (!bank_acc_copy.name) bank_acc_copy.name = '';
        return bank_acc_copy;
      case 'business_location':
        return {
          line_1: business.address_line_1,
          line_2: business.address_line_2,
          city: business.address_city,
          state_province: business.address_state_province,
          country: business.address_country,
          postal_code: business.address_postal_code,
        };
      case 'business_categories':
        return {
          categories: business?.categories?.map(item => item?.id),
        };
      case 'business_shareholder_information':
        return {
          business,
          documents: documents?.filter(
            x => x.type === 'shareholder_identification',
          ),
          onFileLoad: async uploadedDocs => {
            if (!uploadedDocs?.length) return;
            setDocuments(uploadedDocs.concat(documents));
          },
        };
      case 'business_incorporation_documents':
      case 'business_tax_certificate':
      case 'business_finances':
      case 'business_trade_certificate':
        let type = 'other';

        switch (sectionId) {
          case 'business_incorporation_documents':
            type = 'incorporation_certificate';
            break;
          case 'business_tax_certificate':
            type = 'tax_certificate';
            break;
          case 'business_finances':
            type = 'financial_statement';
            break;
          case 'business_trade_certificate':
            type = 'trade_certificate';
            break;

          default:
            break;
        }

        return {
          [sectionId]: groupBy(
            documents
              ?.map(doc =>
                pick(doc, [
                  'type',
                  'document_type',
                  'file',
                  'metadata',
                  'status',
                  'created',
                ]),
              )
              ?.filter(x => x.type === type || x.metadata?.type === type),
            x => x.document_type ?? x.type,
          ),
          onFileLoad: async uploadedDocs => {
            if (!uploadedDocs?.length) return;
            const resp = await uploadDocuments(uploadedDocs);
            setDocuments(resp.data.concat(documents));
            // dispatch(fetchData('documents'));
          },
        };
      default:
        const copy = { ...business };
        delete copy.created;
        delete copy.updated;

        copy.category = copy.category?.id;

        return copy;
    }
  }

  let onboardingProps = {
    initialValueMapper: mapInitialValues,
    currentSection,
    setCurrentSection,
    handleSubmit,
    sections,
    loading: loading || queryProductServiceSettings?.isLoading,
    error,
    locales,
    context: { business },
  };

  return <SettingsContainer {...onboardingProps} {...props} />;
}
