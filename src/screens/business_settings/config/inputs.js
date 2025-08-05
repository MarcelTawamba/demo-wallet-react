export const business_id = {
  name: 'id',
  label: 'business_id',
};

export const business_registered_name = {
  name: 'name',
  label: 'business_registered_name',
};

export const business_trading_name = {
  name: 'business_trading_name',
  label: 'business_trading_name',
};

export const business_category = categories => {
  return {
    name: 'category',
    label: 'business_category',
    type: 'dropdown',
    items: categories,
  };
};

export const business_website = {
  name: 'website',
  label: 'business_website',
};

export const business_location = existing => {
  return {
    name: 'location',
    label: 'business_location',
    type: 'location',
    prefix: 'address_',
    existing,
  };
};

export const business_inc_number = {
  name: 'inc_number',
  label: 'inc_number',
};

export const business_inc_country = {
  name: 'business_inc_country',
  label: 'business_inc_country',
};

export const ein_number = {
  name: 'ein_number',
  label: 'ein_number',
};

export const primary_colors = activeColors => {
  return {
    name: 'primary_colors',
    type: 'dual_color_select',
    itemNames: ['primary', 'primary_contrast'],
    labels: ['Primary color', 'Primary contrast color'],
    active: activeColors,
  };
};

export const secondary_colors = activeColors => {
  return {
    name: 'secondary_colors',
    type: 'dual_color_select',
    itemNames: ['secondary', 'secondary_contrast'],
    labels: ['Secondary color', 'Secondary contrast color'],
    active: activeColors,
  };
};

export const document_upload = existing => {
  return {
    name: 'documents',
    label: 'select_files_to_upload',
    type: 'document_upload',
    multiple: true,
    preview: true,
    preloadedFiles: existing ?? [],
  };
};

export const icon_upload = existing => {
  return {
    name: 'images',
    type: 'dual_icon_upload',
    itemNames: ['logo', 'icon'],
    labels: ['Company logo', 'Company icon'],
    preloadedFiles: existing ?? [],
  };
};

export const address_line_1 = {
  name: 'address_line_1',
  label: 'line_2',
  placeholder: 'e.g. 158 Kloof Street',
};
export const address_line_2 = {
  name: 'address_line_2',
  label: 'line_2',
  placeholder: 'e.g. Gardens',
};
export const address_city = {
  name: 'address_city',
  label: 'city',
  placeholder: 'e.g. Cape Town',
};
export const address_postal_code = {
  name: 'address_postal_code',
  label: 'postal_code',
  placeholder: 'e.g. 9001',
};
export const address_state_province = {
  name: 'address_state_province',
  label: 'state_province',
  placeholder: 'e.g. Western Cape',
};
export const address_country = {
  name: 'address_country',
  label: 'country',
  type: 'country',
  placeholder: 'e.g. South Africa',
};

export const payout_destinations = {
  name: 'destinations',
  label: 'destinations',
  type: 'payout_destinations',
};

export const add_seller = {
  name: 'add_seller',
  label: 'add_seller',
  type: 'checkbox',
  noPadding: true,
};

export const enable_seller = {
  name: 'enable_seller',
  label: 'enable_seller',
  type: 'enable_seller',
};
