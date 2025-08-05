/* 
  validateRequiredFieldsCompletion function is used 
  in onboarding screen for checking all required fields
*/
export function validateRequiredFieldsCompletion(
  requiredTier,
  tiers,
  props = {},
) {
  const requiredTierIndex = requiredTier - 1;
  const currentRequiredTier = tiers[requiredTierIndex];
  let error = null;
  if (currentRequiredTier?.requirementSets?.length > 0) {
    currentRequiredTier.requirementSets.forEach(requirement => {
      if (requirement?.fields) {
        const minRequired =
          requirement.min_condition_matches ?? requirement?.fields.length;

        const completedFields = countCompletedFields({
          fields: requirement.fields,
          ...props,
        });

        if (completedFields < minRequired && !error) {
          error = `${requirement.name} is not completed`;
        }
      }

      if (requirement?.subRequirementSets) {
        requirement.subRequirementSets.forEach(subRequirement => {
          if (subRequirement?.fields) {
            const minRequired =
              subRequirement.min_condition_matches ??
              subRequirement.fields.length;
            const completedFields = countCompletedFields({
              fields: subRequirement.fields,
              ...props,
            });

            if (completedFields < minRequired && !error) {
              error = `${subRequirement.name} is not completed`;
            }
          }
        });
      }
    });
  }

  return error;
}

/* 
  validateRequiredFieldsCompletionHome function is used 
  in home screen to redirect in onboarding screen, In the
  function we are checking all required fields except 
  user required fields
*/

export function validateRequiredFieldsCompletionHome(
  requiredTier,
  tiers,
  props = {},
) {
  let error = null;
  tiers.forEach(currentRequiredTier => {
    if (currentRequiredTier?.requirementSets?.length > 0) {
      currentRequiredTier.requirementSets.forEach(requirement => {
        if (requirement?.fields) {
          let minRequired = requirement.fields.reduce(
            (required, field) =>
              field.resource_type === 'address' ||
              field.resource_type === 'document'
                ? required + 1
                : required,
            0,
          );

          if (
            requirement?.min_condition_matches &&
            requirement.min_condition_matches < minRequired
          ) {
            minRequired = requirement.min_condition_matches;
          }

          const completedFields = countCompletedFieldsHome({
            fields: requirement.fields,
            ...props,
          });

          if (completedFields < minRequired && !error) {
            error = `${requirement.name} is not completed`;
          }
        }

        if (requirement?.subRequirementSets) {
          requirement.subRequirementSets.forEach(subRequirement => {
            if (subRequirement?.fields) {
              let minRequired = subRequirement.fields.reduce(
                (required, field) =>
                  field.resource_type === 'address' ||
                  field.resource_type === 'document'
                    ? required + 1
                    : required,
                0,
              );

              if (
                subRequirement?.min_condition_matches &&
                subRequirement.min_condition_matches < minRequired
              ) {
                minRequired = subRequirement.min_condition_matches;
              }

              const completedFields = countCompletedFieldsHome({
                fields: subRequirement.fields,
                ...props,
              });

              if (completedFields < minRequired && !error) {
                error = `${subRequirement.name} is not completed`;
              }
            }
          });
        }
      });
    }
  });

  return error;
}

const countCompletedFields = ({
  fields = [],
  userDocuments = [],
  user = {},
  addresses = [],
}) => {
  let completedFields = 0;
  fields.forEach(field => {
    if (field.resource_type === 'document') {
      if (
        userDocuments.find(
          document =>
            document?.type?.name === field.name &&
            (document.status === 'pending' || document.status === 'verified'),
        )
      ) {
        completedFields++;
      }
    } else if (field.resource_type === 'user' && user[field.name]) {
      completedFields++;
    } else if (
      field.resource_type === 'address' &&
      addresses?.find(
        address =>
          address.status === 'pending' || address.status === 'verified',
      )
    ) {
      completedFields++;
    } else if (
      field.resource_type === 'email' &&
      user?.verification[field.name]
    ) {
      completedFields++;
    } else if (
      field.resource_type === 'mobile' &&
      user?.verification[field.name]
    ) {
      completedFields++;
    }
  });

  return completedFields;
};

const countCompletedFieldsHome = ({
  fields = [],
  userDocuments = [],
  user = {},
  addresses = [],
}) => {
  let completedFields = 0;
  fields.forEach(field => {
    if (field.resource_type === 'document') {
      if (
        userDocuments.find(
          document =>
            document?.type?.name === field.name &&
            (document.status === 'pending' || document.status === 'verified'),
        )
      ) {
        completedFields++;
      }
    } else if (
      field.resource_type === 'address' &&
      addresses?.find(
        address =>
          address.status === 'pending' || address.status === 'verified',
      )
    ) {
      completedFields++;
    }
  });

  return completedFields;
};
