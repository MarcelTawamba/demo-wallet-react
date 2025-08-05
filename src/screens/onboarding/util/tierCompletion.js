/* eslint-disable no-unused-expressions */
/* eslint-disable no-unreachable */

/**
 * TIER COMPLETION VALIDATION
 * 
 * This function calculates the completion percentage for each tier based on user data.
 * It's used by both the onboarding page and homepage verification prompt to determine
 * if verification requirements are met.
 * 
 * CORE LOGIC:
 * - Iterates through all tiers and their requirement sets
 * - Counts completed fields for each requirement set
 * - Calculates completion percentage based on completed vs total requirements
 * - Marks requirement sets as completed when all fields are satisfied
 * 
 * DOCUMENT STATUS HANDLING:
 * - 'verified' documents: Count as completed ✅
 * - 'pending' documents: Count as completed ✅ (assume they'll be approved)
 * - 'declined' documents: DON'T count as completed ❌
 * - Missing documents: DON'T count as completed ❌
 * 
 * @param {number} requiredTier - Minimum tier level to process (usually 0 to process all)
 * @param {Array} tiers - Array of tier objects with requirement sets
 * @param {Object} props - User data including documents, addresses, user fields
 * @param {Array} props.userDocuments - User's uploaded documents
 * @param {Object} props.user - User profile data
 * @param {Array} props.addresses - User's addresses
 */
export function validateTierAndReqCompletion(requiredTier, tiers, props = {}) {
  // Process each tier to calculate its completion percentage
  tiers.forEach(currentRequiredTier => {
    let currentCompletion = currentRequiredTier.tierCompletionPercentage;

    // Only process tiers that have requirement sets defined
    if (currentRequiredTier?.requirementSets?.length > 0) {
      let requirementCompletion = 0; // Count of completed requirement sets

      // Process each requirement set within the tier
      currentRequiredTier.requirementSets.forEach(requirement => {
        // CASE 1: Simple requirement set with fields only (no sub-requirements)
        if (requirement?.fields && !requirement?.subRequirementSets) {
          const minRequired =
            requirement.min_condition_matches ?? requirement?.fields.length;
          const completedFields = countCompletedFields({
            fields: requirement.fields,
            ...props,
          });

          // Mark requirement as completed if enough fields are satisfied
          if (completedFields >= minRequired) {
            requirement.isCompleted = true;
            requirementCompletion++;
          }
        // CASE 2: Complex requirement set with both fields and sub-requirements
        } else if (requirement?.fields && requirement?.subRequirementSets) {
          const minRequiredFields =
            requirement.min_condition_matches ?? requirement?.fields.length;
          const completedFields = countCompletedFields({
            fields: requirement.fields,
            ...props,
          });

          // Calculate the total number of completed sub-requirements
          let numOfCompletedReq = 0;
          requirement?.subRequirementSets?.forEach(_subRequirement => {
            const minRequiredSubFields =
              _subRequirement.min_condition_matches ??
              _subRequirement.fields.length;
            const completedSubFields = countCompletedFields({
              fields: _subRequirement.fields,
              ...props,
            });
            // Mark sub-requirement as completed if enough fields are satisfied
            if (completedSubFields >= minRequiredSubFields) {
              numOfCompletedReq++;
              _subRequirement.isCompleted = true;
            }
          });

          // Mark main requirement as completed if both fields and sub-requirements are satisfied
          if (
            completedFields >= minRequiredFields &&
            requirement.subRequirementSets.length === numOfCompletedReq
          ) {
            requirement.isCompleted = true;
            requirementCompletion++;
          }
        // CASE 3: Requirement set with only sub-requirements (no main fields)
        } else if (!requirement?.fields && requirement?.subRequirementSets) {
          let subReqCompletion = 0;
          requirement.subRequirementSets.forEach(subRequirement => {
            if (subRequirement?.fields) {
              const minRequired =
                subRequirement.min_condition_matches ??
                subRequirement.fields.length;
              const completedFields = countCompletedFields({
                fields: subRequirement.fields,
                ...props,
              });

              // Mark sub-requirement as completed if enough fields are satisfied
              if (completedFields >= minRequired) {
                subRequirement.isCompleted = true;
                subReqCompletion++;
              }
            }
          });
          const minRequiredSubCompleted =
            requirement.min_condition_matches ??
            requirement?.subRequirementSets.length;

          // Mark requirement as completed if enough sub-requirements are satisfied
          if (subReqCompletion >= minRequiredSubCompleted) {
            requirement.isCompleted = true;
            requirementCompletion++;
          }
        }
      });

      // Calculate final tier completion percentage
      const tierReqNum = currentRequiredTier?.requirementSets.length;
      currentRequiredTier.tierCompletionPercentage = Math.floor(
        (requirementCompletion * 100) / tierReqNum,
      );
    } else {
      // If tier has no requirement sets, consider it 100% complete
      currentRequiredTier.tierCompletionPercentage = 100;
    }
  });
  return; // No return value - function modifies tiers array in place
}

/* 
    validateRequiredFieldsCompletionHome function is used 
    in home screen to redirect in onboarding screen, In the
    function we are checking all required fields except 
    user required fields
  */

/**
 * FIELD COMPLETION COUNTER
 * 
 * This function counts how many fields in a requirement set are completed
 * based on the user's current data. This is the core logic that determines
 * whether declined documents affect verification status.
 * 
 * CRITICAL DOCUMENT STATUS LOGIC:
 * - 'pending' documents: ✅ COUNT as completed (optimistic - assume approval)
 * - 'verified' documents: ✅ COUNT as completed 
 * - 'declined' documents: ❌ DON'T count as completed
 * - Missing documents: ❌ DON'T count as completed
 * 
 * @param {Object} params - Parameters object
 * @param {Array} params.fields - Array of field requirements to check
 * @param {Array} params.userDocuments - User's uploaded documents
 * @param {Object} params.user - User profile data
 * @param {Array} params.addresses - User's addresses
 * @returns {number} Count of completed fields
 */
const countCompletedFields = ({
  fields = [],
  userDocuments = [],
  user = {},
  addresses = [],
}) => {
  let completedFields = 0;
  
  fields.forEach(field => {
    // DOCUMENT REQUIREMENTS (proof_of_identity, proof_of_address, etc.)
    if (field.resource_type === 'document') {
      // Find matching document by type name
      // ONLY count 'pending' and 'verified' documents as completed
      // This is WHY declined documents trigger the verification prompt
      if (
        userDocuments.find(
          document =>
            document?.type?.name === field.name &&
            (document.status === 'pending' || document.status === 'verified'),
        )
      ) {
        completedFields++;
      }
    // USER PROFILE REQUIREMENTS (first_name, last_name, birth_date, etc.)
    } else if (field.resource_type === 'user' && user[field.name]) {
      if (field?.type === 'onboarding_user_status') {
        // Special case: user status must be 'verified'
        if (user?.status === 'verified') {
          completedFields++;
        }
      } else {
        // Regular user fields: just check if value exists
        completedFields++;
      }
    // ADDRESS REQUIREMENTS
    } else if (
      field.resource_type === 'address' &&
      addresses?.find(
        address =>
          address.status === 'pending' || address.status === 'verified',
      )
    ) {
      completedFields++;
    // EMAIL VERIFICATION REQUIREMENTS
    } else if (
      field.resource_type === 'email' &&
      user?.verification[field.name]
    ) {
      completedFields++;
    // MOBILE VERIFICATION REQUIREMENTS
    } else if (
      field.resource_type === 'mobile' &&
      user?.verification[field.name]
    ) {
      completedFields++;
    }
  });

  return completedFields;
};
