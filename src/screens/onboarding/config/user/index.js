import * as _inputs from 'config/inputs';
import * as _customInputs from './inputs';
import {
  completedRequiredFields,
  intersectTierRequirements,
  mapFieldsToInputs,
  validateRequiredFields,
} from '../utils';
import { validateAddress } from 'util/validation';

const formConfig = props => {
  const {
    user = {},
    company = {},
    userAddresses = [],
    documents = [],
    tiers,
    onboardingConfig,
    services = [],
    config: appConfig,
    tier,
  } = props;

  let sections = [
    {
      id: 'user_basic_info',
      title: 'basic_info_title',
      heading: 'basic_info_heading',
      description: 'basic_info_description',
      icon: 'Account',
      image: 'basic_info',
      get hidden() {
        return onboardingConfig?.hideSections?.includes(this.id);
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(user, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
        });
      },
      validate: (values, mappedFields) =>
        validateRequiredFields(values, mappedFields, { services, appConfig }),
    },
    {
      id: 'user_central_bank_number',
      title: 'central_bank_number_title',
      heading: 'central_bank_number_title',
      icon: 'AccountBalance',
      image: 'bank',
      get hidden() {
        return onboardingConfig?.hideSections?.includes(this.id);
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(user, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
          user,
        });
      },
    },
    {
      id: 'user_verify_mobile',
      title: 'verify_mobile_title',
      heading: 'user_verify_mobile_title',
      description: 'verify_mobile_description',
      icon: 'Phone',
      image: 'mobile',
      get hidden() {
        return onboardingConfig?.hideSections?.includes(this.id);
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(user, this.mappedFields, {
          authConfig: appConfig?.authConfig,
        });
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
          user,
        });
      },
      // validate: values => {
      //   const error = validateMobile(values?.verify_mobile?.mobile);
      //   if (error) return { verify_mobile: error };
      // },
    },
    {
      id: 'user_address_verification',
      title: 'user_address_verification_title',
      heading: 'user_address_verification_heading',
      description: 'user_address_verification_subtitle',
      icon: 'AddLocation',
      image: 'address',
      get hidden() {
        return onboardingConfig?.hideSections?.includes(this.id);
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(
          userAddresses.find(x => x.type === 'permanent'),
          this.mappedFields?.filter(x => x !== 'proof_of_address'),
        );
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
        });
      },
      validate: values => validateAddress(values),
    },
    {
      id: 'user_address_verification_document',
      parent: 'user_address_verification',
      title: 'user_address_verification_title',
      heading: 'user_address_verification_document_title',
      description: 'user_address_verification_document_subtitle',
      icon: 'Room',
      image: 'documents',
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          onboardingConfig?.hideSections?.includes(this.id)
        );
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(documents, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
        });
      },
    },
    {
      id: 'user_identity',
      title: 'identity_title',
      heading: 'user_identity_title',
      description: 'user_identity_subtitle',
      icon: 'UserBadge',
      image: 'documents',
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          onboardingConfig?.hideSections?.includes(this.id)
        );
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(documents, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({
          fields: this.mappedFields,
        });
      },
    },
    {
      id: 'user_finance',
      title: 'finances_title',
      heading: 'user_finance_title',
      description: 'user_finance_subtitle',
      image: 'documents',
      icon: 'cash',
      get hidden() {
        return (
          !!onboardingConfig?.documents?.hide ||
          onboardingConfig?.hideSections?.includes(this.id)
        );
      },
      get mappedFields() {
        return intersectTierRequirements({
          section: this.id,
          tiers,
        });
      },
      get completed() {
        return completedRequiredFields(documents, this.mappedFields);
      },
      get fields() {
        return mapFieldsToInputs({ fields: this.mappedFields });
      },
    },
  ].filter(x => x.fields?.length && !x.hidden);

  const completedSections = sections.filter(x => Boolean(x.completed))?.length;
  const isOnboardingComplete = Boolean(
    sections?.length > 0 && sections?.length === completedSections,
  );

  const canSkip = tier?.level >= appConfig?.authConfig?.tier;

  return {
    sections,
    isOnboardingComplete,
    canSkip,
    completedSections,
  };
};

export default formConfig;
