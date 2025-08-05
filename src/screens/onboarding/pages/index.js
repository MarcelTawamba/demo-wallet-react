/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { trackFlow } from 'util/tracking';
import { convertToFormData } from 'util/methods';
import { useSelector, useDispatch } from 'react-redux';
import {
  displayCurrencySelector,
  walletsSelector,
} from 'screens/accounts/redux/selectors';
import {
  configOnboardingSelector,
  configBusinessSelector,
} from 'redux/rehive/selectors';
import OnboardingContainer from 'screens/onboarding/components/OnboardingContainer';

import {
  updateProfile,
  updateProfileImage,
  updateBusinessProfile,
  createMobile,
  submitOTP,
  createBusinessProfile,
  getAddresses,
  getBankAccounts,
  updateItem,
  addBankAccountCurrency,
  deleteBankAccountCurrency,
  getBankAccount,
  updateAddress,
  createAddress,
  deleteAddress,
  getDocuments,
  getBusinessDocuments,
  resendMobileVerification,
  getConversionCurrencies,
  setConversionSettings,
  getProductServiceSettings,
  createDocumentNew as createDocument,
  createBusinessDocument,
  updateBusinessCategories,
  deleteBusinessCategory,
  getBusinessCategories,
  getProfile,
} from 'util/rehive';
import { createSeller, getSellers } from 'screens/products_admin/util/rehive';
import { snakeString } from 'util/general';
import { useTheme } from 'components/app/context';
import {
  BusinessConfig,
  UserConfig,
  getTierConfiguration,
} from 'screens/onboarding/config';
import momentTz from 'moment-timezone';
import {
  findIndex,
  pick,
  groupBy,
  isString,
  difference,
  omitBy,
  omit,
  isEmpty,
} from 'lodash';
import { updateUserProfile } from 'redux/auth/actions';
import { configSettingsSelector } from 'redux/rehive/selectors';
import { useQuery } from 'react-query';
import { useBusiness, useRehiveContext, useRehiveMethods } from 'contexts';
import { useFetchMultiTierRequirementSets } from 'hooks/tierRequirementAPI';
import { useFetchDocumentTypes } from 'hooks/documentAPI';

export default function CombinedOnboarding(props) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const {
    company,
    fetchData,
    isBusinessGroup,
    successFunction,
    isWidget,
    setIsUserOnboarding,
  } = props;

  let [currentSection, setCurrentSection] = useState(0);
  const [error, setError] = useState(true);
  const [userAddresses, setUserAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [conversionCurrencies, setConversionCurrencies] = useState([]);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempMobile, setTempMobile] = useState();
  const [sellers, setSellers] = useState();

  const { tier, tiers, config, user } = useRehiveContext();
  const { refreshTiers } = useRehiveMethods();

  useEffect(() => {
    refreshTiers();
  }, [])
  
  const minimumTierRequirement = useMemo(() => {
    return config?.authConfig?.tier ?? 0;
  }, [config]);
  const userGroup = user?.groups?.[0]?.name;
  const tiersWithRequirementSets = useFetchMultiTierRequirementSets(
    userGroup,
    tiers,
  );
  const documentTypes = useFetchDocumentTypes(company?.id, Boolean(company?.id))
    ?.data?.results;

  const tierConfig = getTierConfiguration({
    tiersWithRequirementSets,
    documentTypes,
    user,
  });

  const { refreshUser } = useRehiveMethods();

  const display_currency = useSelector(displayCurrencySelector);
  const settingsConfig = useSelector(configSettingsSelector);
  const accounts = useSelector(walletsSelector);

  const { business, refetchBusinesses } = useBusiness();
  const onboardingConfig = useSelector(configOnboardingSelector);
  const businessConfig = useSelector(configBusinessSelector);

  const { primaryAccount, companyCurrencies, accountsDictionary } = accounts;
  const salesCurrencies =
    accounts?.accounts?.[accountsDictionary?.sales]?.keys ?? [];

  let services = {};
  company?.services?.length &&
    company.services.map(item => (services[item.name] = true));

  const queryProductServiceSettings = useQuery(
    ['productServiceSettings', company?.id],
    getProductServiceSettings,
  );

  useEffect(() => {
    async function handleFetch() {
      setLoading(true);
      let allPromises = [
        new Promise(resolve => {
          getAddresses().then(resp => {
            setUserAddresses(resp ?? []);
            resolve();
          });
        }),
        new Promise(resolve => {
          getDocuments().then(resp => {
            let tempDocs = resp?.results ?? [];

            if (isBusinessGroup) {
              getBusinessDocuments({ businessId: business?.id }).then(resp => {
                setDocuments(tempDocs.concat(resp?.data?.results ?? []));
                resolve();
              });
            } else {
              setDocuments(tempDocs);
              resolve();
            }
          });
        }),
        new Promise(resolve => {
          getConversionCurrencies().then(resp => {
            setConversionCurrencies(resp?.data?.results ?? []);
            resolve();
          });
        }),
        new Promise(resolve => {
          getBankAccounts().then(resp => {
            setBankAccounts(resp && resp.length && resp[0]);
            resolve();
          });
        }),
      ];
      if (isBusinessGroup) {
        allPromises.push(
          new Promise(resolve => {
            getSellers().then(resp => {
              setSellers(resp?.data?.results);
              resolve();
            });
          }),
        );
      }
      await Promise.all(allPromises);

      setLoading(false);
    }

    if (business?.id || !isBusinessGroup) {
      handleFetch();
    } else {
      refetchBusinesses();
    }
  }, [business?.id]);

  useEffect(() => {
    trackFlow('onboarding', 'landing', null, 'landed', { type: 'user' });
  }, []);

  useEffect(() => {
    setError(null);
    if (tempMobile && !user.mobile) updateUser({}, 'profile');
  }, [currentSection]);

  const timezone = momentTz.tz.guess();

  const currency =
    business?.currency?.code ??
    salesCurrencies.find(item => item === 'USD') ??
    salesCurrencies?.[0];

  const { data: businessCategories, isLoading } = useQuery(
    [company?.id, 'business-categories'],
    getBusinessCategories,
    { enabled: isBusinessGroup },
  );

  const {
    sections: userSections = [],
    completedSections,
    isOnboardingComplete,
  } = UserConfig({
    user,
    company,
    userAddresses,
    documents,
    conversionCurrencies,
    bankAccounts,
    settingsConfig,
    tier,
    tiers,
    onboardingConfig,
    services,
    config,
  });

  const {
    sections: businessSections = [],
    isOnboardingComplete: isBusinessOnboardingCompleted,
  } = BusinessConfig({
    business,
    documents,
    bankAccounts,
    defaults: { colors, currency },
    settingsConfig,
    salesCurrencies,
    businessCategories,
    productServiceSettings: queryProductServiceSettings?.data,
    user,
    sellers,
    setSellers,
    onboardingConfig,
    businessConfig,
  });
  // console.log(
  //   'businessSections',
  //   businessSections,
  //   'isBusinessOnboardingCompleted',
  //   isBusinessOnboardingCompleted,
  // );

  const [state, setState] = useState('form');
  const setSuccessState = (value = 'success') => setState(value);

  useEffect(() => {
    if (userSections?.length && completedSections < userSections?.length) {
      // setting initial onboarding step to the highest completed step if all previous steps of the highest are completed.
      // Otherwise setting uncompleted step of the highest step.
      let _currentSection = completedSections;
      for (let index = 0; index < completedSections; index++) {
        if (!userSections[index].completed) {
          _currentSection = index;
          break;
        }
      }
      setCurrentSection(_currentSection);
      setState('form');
    } else if (
      userSections?.length > 0 &&
      isOnboardingComplete &&
      (businessSections?.length === 0 || isBusinessOnboardingCompleted)
    ) {
      setState('success');
    } else if (
      // Handle case where user meets tier requirements but no sections exist
      userSections?.length === 0 &&
      user?.verification?.tier >= minimumTierRequirement
    ) {
      setState('success');
    }
  }, [completedSections, userSections, user?.verification?.tier, minimumTierRequirement]);

  let combinedSections = [...userSections];

  if (isBusinessGroup)
    combinedSections = [
      ...combinedSections,
      ...businessSections?.map(x => {
        return { ...x, businessSection: true };
      }),
    ];

  let activeSection = combinedSections?.[currentSection];
  // console.log(activeSection);

  useEffect(() => {
    if (activeSection?.id === 'business_information' && !business?.id)
      refetchBusinesses();
  }, [activeSection?.id]);

  // ------- USER ONBOARDING FUNCTIONS ----------------

  async function updateUser(values, area) {
    let response = { status: 'success' };
    try {
      switch (area) {
        case 'profileImage':
          response.data = await updateProfileImage(values.profile);
          break;
        default:
          response.data = await updateProfile(values);
          break;
      }
      dispatch(updateUserProfile(response.data));
    } catch (error) {
      response = error;
      response.status = 'error';
    }

    return response;
  }

  async function updateBasicInfo(values) {
    let response = { status: 'success' };
    const { display_currency } = values;

    await setConversionSettings({ display_currency });
    fetchData('displayCurrency');
    response = await updateUser(values);

    return response;
  }

  async function updateUserAddresses(values) {
    let response = { status: 'success', errors: [] };
    for (const [key, value] of Object.entries(values)) {
      if (isString(value)) continue;

      let filledFields = omitBy(
        omit(value, ['created', 'id', 'status', 'updated', 'type']),
        x => !x,
      );

      if (isEmpty(filledFields)) continue;

      try {
        let existing = userAddresses.find(item => item.type === key);

        if (!existing && value) {
          const resp = await createAddress({ type: key, ...value });
          setUserAddresses([...userAddresses, resp]);
        } else if (existing) {
          if (value) {
            const resp = await updateAddress({ id: existing.id, ...value });
            let copy = [...userAddresses];
            const index = findIndex(copy, { type: key });
            copy.splice(index, 1, resp);
            setUserAddresses(copy);
          } else {
            await deleteAddress(existing.id);
            setUserAddresses(userAddresses.filter(x => x.type !== key));
          }
        }
      } catch (error) {
        response.errors.push(error.message);
      }
    }
    return response;
  }

  function updateUserDocuments(values) {
    let response = { status: 'success' };
    let additions = [];
    (values?.documents?.filter(x => x.files?.length) ?? []).forEach(x => {
      x.files.forEach(file => {
        if (file.id) additions.push(file);
      });
    });
    setDocuments([...documents, ...additions]);

    return response;
  }

  async function handleMobileVerification(values, setFieldValue) {
    let response = { status: 'success' };
    const { verify_mobile, mobile, verification } = values;

    if (!mobile && !verify_mobile.mobile) return response;

    if (verify_mobile.verifyStep) {
      try {
        await submitOTP(verify_mobile.otp);
        dispatch(
          updateUserProfile({
            ...user,
            mobile: verify_mobile.mobile,
            verification: { ...user.verification, mobile: true },
          }),
        );
      } catch (e) {
        response.status = 'error';
        response.message = e.message;
        // setFieldError('mobile', e.message);
      }
    } else {
      if (mobile === verify_mobile.mobile) {
        if (verification.mobile) return response;
        else await resendMobileVerification(mobile, company?.id);
      } else {
        try {
          await createMobile({
            number: verify_mobile.mobile,
            primary: true,
          });

          setTempMobile(verify_mobile.mobile);
        } catch (e) {
          response.status = 'error';
          response.message = e.message;
          return response;
        }
      }

      setFieldValue('verify_mobile', {
        ...verify_mobile,
        verifyStep: true,
      });

      setError(null);
      return false;
    }

    return response;
  }

  async function handleSubmit(
    values,
    { setSubmitting = () => {}, setFieldValue = () => {} } = {},
  ) {
    let resp = {};

    switch (activeSection.id) {
      case 'user_basic_info':
        resp = await updateBasicInfo(values);
        break;
      case 'user_central_bank_number':
        resp = await updateUser(pick(values, ['central_bank_number']));
        break;
      case 'user_address_verification':
        resp = await updateUserAddresses({ permanent: values });
        // await refreshUser();
        break;
      case 'user_address_verification_document':
      case 'user_finance':
        resp = updateUserDocuments(values);
        // await refreshUser();
        break;
      case 'user_identity':
        resp = await updateUser(values);
        resp = await uploadDocuments({ docs: values.uploadedDocuments ?? [] });
        setDocuments([...documents, ...(resp?.data ?? [])]);
        // await refreshUser();
        break;
      case 'user_verify_mobile':
        resp = await handleMobileVerification(values, setFieldValue);
        if (!resp) return setSubmitting(false);
        // await refreshUser();
        break;
      case 'business_information':
        resp = await updateBusiness(values);
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
      case 'business_seller_features':
        resp = await addSeller(values);
        break;
      case 'business_location':
        const mappedValues = mapStructure(values);
        resp = await updateBusiness(mappedValues);
        break;
      case 'business_banking':
        resp = await saveBankDetails(values);
        if (resp?.status === 'success') setBankAccounts(resp?.data ?? null);
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
      default:
        if (activeSection.id?.includes('business_')) {
          const mappedValues = mapStructure(values);
          resp = await updateBusiness(mappedValues);
        } else resp = await updateUser(values);
        break;
    }

    if (resp?.status === 'success') {
      trackFlow('onboarding', 'step', ['next button'], 'clicked', {
        type: 'user',
        step: activeSection.title,
        // complete: activeSection.completed,
        final: currentSection + 1 === combinedSections.length,
      });

      if (currentSection + 1 < combinedSections.length) {
        setCurrentSection(++currentSection);
      } else setState('success');
    } else setError(resp?.message ?? 'Unable to update business profile');

    setSubmitting(false);
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

      const resp2 = await getBankAccount(resp?.id);
      response.data = resp2;
    } catch (error) {
      response.status = 'error';
      response.message = error.message;
    }

    return response;
  }

  function mapInitialValues(sectionId) {
    switch (sectionId) {
      case 'user_basic_info':
        return {
          display_currency: display_currency?.code ?? '',
          ...pick(user, [
            'first_name',
            'last_name',
            'birth_date',
            'gender',
            'nationality',
            'id_number',
            'title',
            'marital_status',
            'fathers_name',
            'mothers_name',
            'grandfathers_name',
            'grandmothers_name',
          ]),
        };
      case 'user_verify_mobile':
        return pick(user, ['mobile', 'verification']);
      case 'user_identity':
      case 'user_finance':
      case 'user_address_verification_document':
        return {
          documents: groupBy(
            documents?.map(doc =>
              pick(doc, ['document_type', 'file', 'status', 'created']),
            ),
            'document_type',
          ),
          id_number: user.id_number,
        };
      case 'user_address_verification':
        const addressData =
          userAddresses?.find(x => x.type === 'permanent') ?? {};
        if (isEmpty(addressData)) {
          addressData['country'] = user?.nationality;
        }
        return addressData;
      case 'business_information':
        return {
          ...pick(business, ['name', 'category', 'website']),
          currency,
        };
      case 'business_banking':
        const bank_acc_copy = {
          ...bankAccounts,
          currencies: bankAccounts?.currencies?.map(item => item.code),
          branch_address: [
            bankAccounts?.branch_address?.line_1,
            bankAccounts?.branch_address?.line_2,
            bankAccounts?.branch_address?.city,
            bankAccounts?.branch_address?.state_province,
            bankAccounts?.branch_address?.country,
            bankAccounts?.branch_address?.postal_code,
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
            x => x?.type === 'shareholder_identification',
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
              .map(doc =>
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
            const resp = await uploadDocuments({
              type: 'business',
              docs: uploadedDocs,
            });
            setDocuments(resp.data.concat(documents));
          },
        };
      default:
        if (sectionId.includes('business_')) {
          const copy = { ...business };
          delete copy.created;
          delete copy.updated;

          copy.category = copy.category?.id;

          return copy;
        }

        return { ...user };
    }
  }

  function mapInitialValues2(fields) {
    let values = {};
    fields.forEach(field => {
      switch (field.resource_type) {
        case 'user':
          values[field.name] = user[field.name];
          break;
        case 'email':
          values['email'] = user.email;
          values['email_verification'] = user.verification?.email;
          break;
        case 'mobile':
          values['mobile'] = user.mobile;
          values['mobile_verification'] = user.verification?.mobile;
          break;
        default:
          if (field.resource_type?.includes('business_')) {
            const copy = { ...business };
            delete copy.created;
            delete copy.updated;

            copy.category = copy.category?.id;

            values = copy;
          }
      }
    });
    // console.log('initialValues', fields, values);
    return values;
  }

  // ------- BUSINESS ONBOARDING FUNCTIONS ----------------

  async function updateBusiness(values, isFile = false) {
    let response = {};
    try {
      if (business?.id) {
        if (activeSection?.id === 'business_location')
          values = {
            address_line_1: values.line_1,
            address_line_2: values.line_2,
            address_city: values.city,
            address_state_province: values.state_province,
            address_country: values.country,
            address_postal_code: values.postal_code,
          };
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
    } catch (error) {
      response = {
        status: 'error',
        message: error.message,
      };
    }
    refetchBusinesses();

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

  async function uploadDocuments({ type = 'user', docs }) {
    let response = { status: 'success', message: '', data: [] };

    await Promise.all(
      docs.map(
        async doc =>
          new Promise(resolve => {
            const docCreationFunctions = {
              business: createBusinessDocument,
              user: createDocument,
            };

            docCreationFunctions[type]({
              businessId: business?.id,
              file: doc.file,
              type: doc.type,
              metadata: {
                name: doc.name,
                ...doc.metadata,
              },
            })
              .then(resp => {
                response.data.push(type === 'business' ? resp?.data : resp);
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

  function mapStructure(values) {
    const { primary_colors, secondary_colors, location, destinations } = values;

    if (primary_colors || secondary_colors)
      values.colors = { ...primary_colors, ...secondary_colors };

    if (location) values = { ...values, ...values.location };
    if (destinations)
      values.destinations = destinations.map(item => ({
        ...item,
        currency: item?.currency?.code ?? item?.currency ?? '',
      }));

    return omit(values, [
      'primary_colors',
      'secondary_colors',
      'documents',
      'images',
      'location',
      !values.icon || typeof values.icon === 'string' ? 'icon' : '',
      !values.logo || typeof values.logo === 'string' ? 'logo' : '',
    ]);
  }

  const onboardingProps = {
    type: 'user',
    initialValueMapper: mapInitialValues2,
    isOnboardingComplete,
    onboardingRequired: onboardingConfig.required ? true : false,
    handleSubmit,
    isBusinessGroup,
    loading,
    error,
    context: { business, company, user },
    services,
    state,
    tierConfig,
    documentTypes,
    minimumTierRequirement,
    userGroup,
    setSuccessState,
    successFunction,
    isWidget,
    setIsUserOnboarding,
    combinedSections,
    currentSection,
    setCurrentSection,
  };

  return <OnboardingContainer {...onboardingProps} />;
}
