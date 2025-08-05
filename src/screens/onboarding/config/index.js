/* eslint-disable no-unused-expressions */
import { isEmpty } from 'lodash';
import BusinessConfig from './business';
import UserConfig from './user';

export { BusinessConfig, UserConfig };

const isCompleted = () => {
  return false;
};

const getFields = (requirementSet, documentTypes) => {
  const items = requirementSet.items;
  let reqSetFields = [];
  let isDocumentSelection = true, // these fields will be used for selecting documents before uploading documents
    isDocumentSelectionCompleted = false, // this field will be used for identifying which screen to show document selection or document upload
    selectedDocuments = [];
  items.forEach(item => {
    if (item.rule.resource === 'user') {
      isDocumentSelection = false;
      const condition = Object.keys(item.rule.condition)[0];
      const conditionArray = condition.split('__');
      let fieldProperties = {
        itemId: item.id,
        name: conditionArray[0],
        type:
          conditionArray[0] === 'status'
            ? 'onboarding_user_status'
            : conditionArray[0],
        label: item.name,
        required:
          conditionArray[0] === 'status'
            ? false
            : !item.rule.condition[condition],
        item_type: item.type,
        resource_type: item.rule.resource,
      };
      if (fieldProperties.name === 'nationality') {
        fieldProperties.type = 'country';
        fieldProperties.returnCode = true; // Country input has a weird condition to set value as country name or code
      } else if (fieldProperties.name === 'birth_date') {
        fieldProperties.disableFuture = true;
      }
      reqSetFields.push(fieldProperties);
    } else if (item.rule.resource === 'email') {
      isDocumentSelection = false;
      reqSetFields.push({
        itemId: item.id,
        name: 'email',
        type: 'onboarding_email',
        label: '',
        verified: item.rule?.condition?.verified,
        item_type: item.type,
        resource_type: item.rule.resource,
      });
    } else if (item.rule.resource === 'mobile') {
      isDocumentSelection = false;
      reqSetFields.push({
        itemId: item.id,
        name: 'mobile',
        type: 'onboarding_mobile',
        label: item.name,
        verified: item.rule?.condition?.verified,
        item_type: item.type,
        resource_type: item.rule.resource,
      });
    } else if (item.rule.resource === 'document') {
      const customFieldName = item.name;
      reqSetFields.push({
        itemId: item.id,
        name: customFieldName,
        type: 'onboarding_document',
        label: item.name,
        description: item.description,
        verified: item.rule?.condition?.status === 'verified',
        item_type: item.type,
        resource_type: item.rule.resource,
        documentType: documentTypes?.find(
          dType => dType.id === item.rule?.condition?.type__id,
        ),
      });
    } else if (item.rule.resource === 'address') {
      isDocumentSelection = false;
      const customFieldName = 'address';
      reqSetFields.push({
        itemId: item.id,
        name: customFieldName,
        type: 'onboarding_address',
        label: item.name,
        description: item.description,
        verified: item.rule?.condition?.status === 'verified',
        item_type: item.type,
        resource_type: item.rule.resource,
      });
    } else if (item.rule.resource === 'bank_account') {
      isDocumentSelection = false;
      // TODO
    }
  });

  requirementSet.fields = reqSetFields;
  requirementSet.isDocumentSelection = isDocumentSelection;
  requirementSet.isDocumentSelectionCompleted = isDocumentSelectionCompleted;
  requirementSet.selectedDocuments = selectedDocuments;
  return requirementSet;
};

export function getTierConfiguration({
  tiersWithRequirementSets,
  documentTypes,
}) {
  if (isEmpty(tiersWithRequirementSets) && isEmpty(documentTypes)) {
    return [];
  }

  let prevTier = null,
    prevReqSet = null,
    prevSubReqSet = null;
  tiersWithRequirementSets.forEach(tier => {
    tier.prevTier = prevTier;
    tier.prevReqSet = prevReqSet;
    tier.prevSubReqSet = prevSubReqSet;
    tier.tierCompletionPercentage = 0;
    // tier.name === 'Basic' ? 100 : tier.name === 'Intermediate' ? 65 : 30;
    tier.requirementSets?.forEach(requirementSet => {
      requirementSet.tierId = tier.id;
      requirementSet.prevTier = prevTier;
      requirementSet.prevReqSet = prevReqSet;
      requirementSet.prevSubReqSet = prevSubReqSet;
      if (!isEmpty(requirementSet?.items)) {
        requirementSet = getFields(requirementSet, documentTypes);
        requirementSet.isCompleted = isCompleted();
      }
      if (isEmpty(requirementSet?.items)) {
        requirementSet.isCompleted = isCompleted();
      }

      if (!isEmpty(requirementSet?.subRequirementSets)) {
        requirementSet.subRequirementSets.forEach(subRequirementSet => {
          subRequirementSet.prevTier = prevTier;
          subRequirementSet.prevReqSet = prevReqSet;
          subRequirementSet.prevSubReqSet = prevSubReqSet;
          subRequirementSet = getFields(subRequirementSet, documentTypes);
          subRequirementSet.isCompleted = isCompleted();
          prevSubReqSet = subRequirementSet.id;
        });
      } else {
        prevSubReqSet = null;
      }
      prevReqSet = requirementSet.id;
    });
    prevTier = tier.id;
  });
  return tiersWithRequirementSets;
}
